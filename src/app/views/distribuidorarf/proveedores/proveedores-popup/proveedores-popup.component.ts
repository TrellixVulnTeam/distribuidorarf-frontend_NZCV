import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Component, ElementRef, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Canton } from 'app/interfaces/canton';
import { Distrito } from 'app/interfaces/distrito';
import { ProveedorDto } from 'app/interfaces/dto/proveedor-dto';
import { ErrorBk } from 'app/interfaces/error-bk';
import { Provincia } from 'app/interfaces/provincia';
import { TipoIdentificacion } from 'app/interfaces/tipo-identificacion';
import { Token } from 'app/interfaces/token';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { StringManager } from 'app/managers/string-manager';
import { CantonesService } from 'app/services/cantones.service';
import { FuncionesService } from 'app/services/funciones.service';
import { ProveedoresService } from 'app/services/proveedores.service';
import { ProvinciasService } from 'app/services/provincias.service';
import { TiposIdentificacionService } from 'app/services/tipos-identificacion.service';
import { UserApiService } from 'app/services/user-api.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { environment } from 'environments/environment';
import { CustomValidators } from 'ngx-custom-validators';

declare const google: any;
declare const $: any;

@Component({
  selector: 'app-proveedores-popup',
  templateUrl: './proveedores-popup.component.html',
  styleUrls: ['./proveedores-popup.component.scss']
})
export class ProveedoresPopupComponent implements OnInit {

  public itemForm: FormGroup;
  public secondFormGroup: FormGroup;
  isLinear = false;  
  listaEmpleados: any[] = [];

  //-- para el mapa --
  zoom = 17;
  mapCenter = {
    lat: null,
    lng: null
  }

  geocoder;

  labelOptions = {
    text: "Una Dirección"
  }

  tournament: any = {venue:{address: 'Costa Rica'}};
  @ViewChild('search')
  public searchElementRef: ElementRef;

  markers: marker[] = [
	  {
		  lat: this.mapCenter.lat,
		  lng: this.mapCenter.lng,
		  draggable: true
	  }
  ]  

  token: Token = {
    access_token: ``
  }

  proveedorDTO: ProveedorDto = {
    identificacion: null,
    nombre: null,
    comentarios: null,
    correoElectronico: null,
    direccion: null,    
    estaActivo: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    latLongDireccion: null,
    telefono: null,    
    url: null,
    otrasSenas: null,
    codigoResponsable: null
  }

  provincias: Provincia[] = [];
  cantones: Canton[] = [];
  distritos: Distrito[] = [];

  cantonNuevo: Canton = {
    codCanton: null,
    distritos: null,
    idCanton: null,
    nombre: null,
    provincia: null
  }

  provinciaNueva: Provincia = {
    cantones: null,
    cod: null,
    nombre: null
  }

  idCanton: number;
  codDistrito: number;
  codProvincia: number;
  validaProveedor: contador = {
    proveedorexiste: null
  }

  esEditar: boolean = false;

  error: ErrorBk = {
    statusCode: null,
    message: null
  };
  intentos = 0;
  serviceManager = ServiceManager;
  strings = StringManager;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProveedoresPopupComponent>,
    private fb: FormBuilder,
    private tokenService: UserApiService,
    private snack: MatSnackBar,    
    private mapsAPILoader: MapsAPILoader, 
    private ngZone: NgZone,
    private proveedoresService: ProveedoresService,
    private funcionesService: FuncionesService,
    private loader: AppLoaderService,
  ) { }

  ngOnInit(): void {    
    this.loader.open();
    this.buildItemForm(this.data.payload);                   
    this.mapsAPILoader.load().then(() => {     
      this.setCurrentLocation();                   
      this.geocoder = new google.maps.Geocoder;      
  
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {         
          
          var place = autocomplete.getPlace();                   

          this.mapCenter.lat = place.geometry.location.lat();
          this.mapCenter.lng = place.geometry.location.lng();
          this.zoom = 17;

          this.tournament.venue.address = place.formatted_address;
          this.secondFormGroup.controls.latLongDireccion.setValue(place.geometry.location.lat() + "," + place.geometry.location.lng());
          this.secondFormGroup.controls.direccion.setValue(this.tournament.venue.address);

          this.markers.push({
            lat: this.mapCenter.lat,
            lng: this.mapCenter.lng,
            draggable: true
          })
        });
      });
    });
    this.cargarEmpleados();
    if(this.data.payload.identificacion != '' && this.data.payload.identificacion != null){      
      this.esEditar = true;
      this.mapCenter.lat = this.data.payload.latLongDireccion.split(',')[0];
      this.mapCenter.lng = this.data.payload.latLongDireccion.split(',')[1];

      this.markers.push({
        lat: this.data.payload.latLongDireccion.split(',')[0],
        lng: this.data.payload.latLongDireccion.split(',')[1],
        draggable: true
      });             
    }
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({      
      identificacion: [item.identificacion || -1],
      nombre: [item.nombre || '', Validators.required],      
      telefono: [item.telefono || ''],
      correoElectronico: [item.correoElectronico || '', [Validators.required, Validators.email]],
      comentarios: [item.comentarios || ''],       
      estaActivo: [item.estaActivo || false],
      url: [item.url || '', [CustomValidators.url]],
      autorizacionEmpleado: ['', Validators.required]
    });
    this.secondFormGroup = this.fb.group({
      direccion: [item.direccion || ''],
      latLongDireccion: [item.latLongDireccion || ''],      
      googleSearch: [''],
      otrasSenas: [item.otrasSenas || '']
    });
  }

  private setCurrentLocation() {        
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {        
        this.mapCenter.lat = position.coords.latitude;
        this.mapCenter.lng = position.coords.longitude;
        this.zoom = 17;
        this.getAddress(this.mapCenter.lat, this.mapCenter.lng);
      });
    }
  }  
  
  getAddress(latitude, longitude) {    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {        
      if (status === 'OK') {
        if (results[0]) {          
          this.zoom = 17;
          this.tournament.venue.address = results[0].formatted_address;
        } else {          
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
  
    });
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    this.mapCenter.lat = $event.coords.lat;
    this.mapCenter.lng = $event.coords.lng;        
    const latlng = new google.maps.LatLng(this.mapCenter.lat, this.mapCenter.lng);
    const request = {
      latLng: latlng
    };

    this.geocoder.geocode(request, (results, status) => {
      this.ngZone.run(() => {
        this.tournament.venue.address = results[0].formatted_address;
        this.secondFormGroup.controls.latLongDireccion.setValue(results[0].geometry.location.lat() + "," + results[0].geometry.location.lng());
        console.log(results[0].geometry.location.lat() + "," + results[0].geometry.location.lng());
      })
    });   
  console.log('1:' + this.tournament.venue.address);
  this.secondFormGroup.controls.direccion.setValue(this.tournament.venue.address);
  }
  
  submit(){

     if(this.empleadoConAutrizacion()){
       this.finalizarProceso();
     }else{
      this.snack.open("El código de empleado no es correcto. Por favor validarlo y volver a intentarlo.", "ERROR", { duration: 4000 });         
     }
  
  }

  finalizarProceso(){
    this.proveedorDTO.identificacion = this.itemForm.controls.identificacion.value;
    this.proveedorDTO.nombre = this.itemForm.controls.nombre.value;
    this.proveedorDTO.comentarios = this.itemForm.controls.comentarios.value;
    this.proveedorDTO.correoElectronico = this.itemForm.controls.correoElectronico.value;
    this.proveedorDTO.telefono = this.itemForm.controls.telefono.value;
    this.proveedorDTO.estaActivo = this.itemForm.controls.estaActivo.value;
    this.proveedorDTO.url = this.itemForm.controls.url.value;

    this.proveedorDTO.latLongDireccion = this.secondFormGroup.controls.latLongDireccion.value;
    this.proveedorDTO.direccion = this.secondFormGroup.controls.direccion.value;        
    this.proveedorDTO.otrasSenas = this.secondFormGroup.controls.otrasSenas.value;
    this.proveedorDTO.codigoResponsable = this.itemForm.controls.autorizacionEmpleado.value;    
    
    if(this.esEditar){      
      this.proveedoresService.update(this.proveedorDTO.identificacion, this.proveedorDTO).subscribe(
        res => {          
          this.dialogRef.close(this.proveedorDTO);          
        },
        err => {
          this.reintento(err, nombresMetodos.finalizarProceso);
        }
      );
    }else{
      this.funcionesService.validaProveedorExiste(this.proveedorDTO.nombre).subscribe(
        res =>{
          this.validaProveedor = res[0];        
          if(this.validaProveedor.proveedorexiste == 0){            
            this.proveedoresService.newRow(this.proveedorDTO).subscribe(
              res => {                
                this.dialogRef.close(this.proveedorDTO);
              },
              err => {
                this.reintento(err, nombresMetodos.finalizarProceso);
              }
            );          
          }else{
            this.snack.open("El cliente ya existe", "Atención!!", { duration: 4000 });                   
          }
        },
        err =>{
          this.reintento(err, nombresMetodos.finalizarProceso);
        }
      );  

    }       
  }

  empleadoConAutrizacion(){
    let autorizado = false;    
    this.listaEmpleados.forEach(element => {      
      if(element.codigoAutorizacion === this.itemForm.controls.autorizacionEmpleado.value){
        autorizado = true;
        return autorizado;
      }      
    });

    return autorizado;
  }

  cargarEmpleados(){
    this.funcionesService.obtenerEmpleados().subscribe(
      res => {        
        this.loader.close();
        this.listaEmpleados = res;        
      },
      err => {
        this.reintento(err, nombresMetodos.cargarEmpleados);
      }
    );
  }

  reintento(err: any, metodo: string, data?: any, isNew?: boolean, url?: string, id?: number){    
    this.error = err.error;
    if(this.intentos == this.serviceManager.MAX_INTENTOS){
      this.snack.open(this.strings.error_mgs_cantidad_intentos, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });
    }else{
      if(this.error.statusCode == 401){
        this.intentos += 1;
        this.tokenService.login().subscribe(
          res => {
              this.token = res;
              LocalStorageManger.setToken(this.token.access_token);
              this.intentos = 1;
              if(metodo === nombresMetodos.cargarEmpleados){
                this.cargarEmpleados();
              }else if(metodo === nombresMetodos.finalizarProceso){
                this.finalizarProceso();
              }else{
                this.snack.open(this.strings.error_mgs_metodo_no_encontrado + metodo, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });
              }
          },
          err => {
            this.intentos = 1;
            this.loader.close(); 
            this.snack.open(err.message, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });
          }
        );              
      }else{
        this.intentos = 1;
        this.loader.close();
        this.snack.open(this.strings.factura_error_lista + err.message, this.strings.cerrar_title, { duration: environment.TIEMPO_NOTIFICACION });
      }
    }
  }

}

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

interface contador {
  proveedorexiste: number
}

enum nombresMetodos {  
  cargarEmpleados = "cargarEmpleados",  
  finalizarProceso = "finalizarProceso"
}