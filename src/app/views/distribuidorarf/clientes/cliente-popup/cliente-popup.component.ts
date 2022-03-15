import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Component, ElementRef, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Canton } from 'app/interfaces/canton';
import { Distrito } from 'app/interfaces/distrito';
import { PersonaDto } from 'app/interfaces/dto/persona-dto';
import { Persona } from 'app/interfaces/persona';
import { Provincia } from 'app/interfaces/provincia';
import { Termino } from 'app/interfaces/termino';
import { TipoIdentificacion } from 'app/interfaces/tipo-identificacion';
import { TipoPersona } from 'app/interfaces/tipo-persona';
import { Token } from 'app/interfaces/token';
import { UserApi } from 'app/interfaces/user-api';
import { CantonesService } from 'app/services/cantones.service';
import { FuncionesService } from 'app/services/funciones.service';
import { NotificacionesService } from 'app/services/notificaciones.service';
import { PersonaService } from 'app/services/persona.service';
import { ProvinciasService } from 'app/services/provincias.service';
import { TerminosService } from 'app/services/terminos.service';
import { TiposIdentificacionService } from 'app/services/tipos-identificacion.service';
import { TiposPersonaService } from 'app/services/tipos-persona.service';
import { UserApiService } from 'app/services/user-api.service';
import { environment } from 'environments/environment';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

declare const google: any;
declare const $: any;

@Component({
  selector: 'app-cliente-popup',
  templateUrl: './cliente-popup.component.html',
  styleUrls: ['./cliente-popup.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class ClientePopupComponent implements OnInit {
  public itemForm: FormGroup;
  public secondFormGroup: FormGroup;
  public thirdFormGroup: FormGroup;
  isLinear = false;  

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

  tokenUserApi: Token = {
    access_token: ``
  }

  user: UserApi = {
    username: environment.API_USER,
    password: environment.API_PASS
  }

  provincia: Provincia = {
    cantones: null,
    cod: ``,
    nombre:``
  }

  persona: Persona = {
    identificacion: null,
    nombre: null,
    apellidos: null,
    codigoAutorizacion: null,
    comentarios: null,
    contactoRef: null,
    contrasena: null,
    correoElectronico: null,
    direccion: null,
    distrito: null,
    estaActivo: null,
    fechaCreacion: null,
    fechaCumpleannos: null,
    fechaUltimaModificacion: null,
    latLongDireccion: null,
    maxCredito: null,
    saldoFavor: null,
    telefono1: null,
    telefono2: null,
    telefonoRef: null,
    termino: null,
    tipoIdentificacion: null,
    tipoPersona: null,
    usuario: null,
    otrasSenas: null
  }

  personaDTO: PersonaDto = {
    identificacion: null,
    nombre: null,
    apellidos: null,
    codigoAutorizacion: null,
    comentarios: null,
    contactoRef: null,
    contrasena: null,
    correoElectronico: null,
    direccion: null,
    distrito: null,
    estaActivo: null,
    fechaCreacion: null,
    fechaCumpleannos: null,
    fechaUltimaModificacion: null,
    latLongDireccion: null,
    maxCredito: null,
    saldoFavor: null,
    telefono1: null,
    telefono2: null,
    telefonoRef: null,
    termino: null,
    tipoIdentificacion: null,
    tipoPersona: null,
    usuario: null,
    otrasSenas: null
  }

  provinciaNueva: Provincia = {
    cantones: null,
    cod: ``,
    nombre:``
  }

  distrito: Distrito = {
    codDistrito: 0,
    nombre: ``,
    canton: null,
    distrito: ``,
    personas: null,
    provincia: ``
  }
  
  cantonNuevo: Canton = {
    codCanton: ``,
    distritos: null,
    idCanton: 0,
    nombre: ``,
    provincia: null
  }

  canton: Canton = {
    codCanton: ``,
    distritos: null,
    idCanton: 0,
    nombre: ``,
    provincia: null
  }

  termino: Termino = {
    descripcion: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    idTermino: null,
    nombre: null,
    valor: null
  }

  provincias: Provincia[] = [];
  cantones: Canton[] = [];
  distritosNuevos: Distrito[] = [];
  distritos: Distrito[] = [];
  tiposIdentificacion: TipoIdentificacion[] = [];  
  terminos: Termino[] = [];
  tiposPersona: TipoPersona[] = [];
  esEditar: boolean = false;

  validaPersona: contador = {
    clienteexiste: null
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ClientePopupComponent>,
    private fb: FormBuilder,
    private userApiService: UserApiService,
    private snack: MatSnackBar,
    private provinciasService: ProvinciasService,
    private notificacionesService: NotificacionesService,
    private cantonesService: CantonesService,
    private tiposIdentificacionService: TiposIdentificacionService,
    private mapsAPILoader: MapsAPILoader, 
    private ngZone: NgZone,
    private terminosService: TerminosService,
    private tiposPersonaService: TiposPersonaService,
    private funcionesService: FuncionesService,
    private personasService: PersonaService
  ) { }

  ngOnInit(): void {         
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
    this.buildItemForm(this.data.payload);                   
    this.userApiService.login().subscribe(
      res => {          
          this.tokenUserApi = res;                           
          this.cargarProvincias();                        
          this.cargarTiposIdentificacion();
          this.cargarTerminos();
          this.cargarTiposPersona();

          if(this.data.payload.identificacion != '' && this.data.payload.identificacion != null){      
            
            this.personaDTO.tipoIdentificacion = this.data.payload.tipoIdentificacion.idTipoIdetificacion;
            this.provincia = this.data.payload.distrito.canton.provincia;
            this.cambiaSeleccionProvincia(this.provincia.cod);
            this.canton = this.data.payload.distrito.canton;
            this.cambiaSeleccionCanton(this.canton.idCanton);            
            this.distrito = this.data.payload.distrito;    
            this.distrito.codDistrito = this.data.payload.distrito.codDistrito;    
            console.log(this.distrito.codDistrito);
            this.cambiaSeleccionDistrito(this.distrito.codDistrito);            
            
            this.termino.idTermino = this.data.payload.termino.idTermino;
            this.personaDTO.tipoPersona = this.data.payload.termino.idTipoPersona;

            this.esEditar = true;

            this.mapCenter.lat = this.data.payload.latLongDireccion.split(',')[0];
            this.mapCenter.lng = this.data.payload.latLongDireccion.split(',')[1];

            this.markers.push({
              lat: this.data.payload.latLongDireccion.split(',')[0],
              lng: this.data.payload.latLongDireccion.split(',')[1],
              draggable: true
            });             
          }      
      },
      err => {
          this.snack.open(err.message, "ERROR", { duration: 4000 });
      }
    );    
  }

  buildItemForm(item) {            
    this.itemForm = this.fb.group({      
      identificacion: [item.identificacion || '', Validators.required],
      nombre: [item.nombre || '', Validators.required],
      apellidos: [item.apellidos || ''],
      telefono1: [item.telefono1 || ''],
      telefono2: [item.telefono2 || ''],
      correoElectronico: [item.correoElectronico || '', [Validators.required, Validators.email]],
      comentarios: [item.comentarios || ''],
      fechaCumpleannos: [item.fechaCumpleannos || ''],
      codigoAutorizacion: [item.codigoAutorizacion || ''],
      estaActivo: [item.estaActivo || false],
      fechaCumpleanos: [item.fechaCumpleannos || '', [Validators.required]]      
    });
    this.secondFormGroup = this.fb.group({
      direccion: [item.direccion || ''],
      latLongDireccion: [item.latLongDireccion || ''],
      maxCredito: [item.maxCredito || 0],
      saldoFavor: [item.saldoFavor || 0],
      googleSearch: [''],
      otrasSenas: [item.otrasSenas || ''] 
    });
    this.thirdFormGroup = this.fb.group({
      telefonoRef: [item.telefonoRef || ''],
      contactoRef: [item.contactoRef || '']
    });
  }

  cargarProvincias(){  
    this.provinciasService.getAll(this.tokenUserApi.access_token).subscribe(
      res => {
          this.provincias = res;                             
      }
    );    
  }

  cargarTiposIdentificacion(){     
    this.tiposIdentificacionService.getAll(this.tokenUserApi.access_token).subscribe(
      res => {
        this.tiposIdentificacion = res;                    
      },
      err => {
        console.log(err);
        this.notificacionesService.mostrarNotificacionError("<strong>ERROR!!!</strong>", err.message);         
      }
    );    
  }

  cargarTiposPersona(){     
    this.tiposPersonaService.getAll(this.tokenUserApi.access_token).subscribe(
      res => {
        this.tiposPersona = res;        
        console.log(this.tiposPersona);
        this.tiposPersona.forEach(element => {
          if(element.nombre === "Cliente"){
            this.personaDTO.tipoPersona = element.idTipoPersona;
          }          
        });            
      },
      err => {
        console.log(err);
        this.notificacionesService.mostrarNotificacionError("<strong>ERROR!!!</strong>", err.message);         
      }
    );    
  }

  cargarTerminos(){          
    this.terminosService.getAll(this.tokenUserApi.access_token).subscribe(
      res => {
        this.terminos = res;                    
      },
      err => {
        console.log(err);
        this.notificacionesService.mostrarNotificacionError("<strong>ERROR!!!</strong>", err.message);         
      }
    );    
  }

  cambiaSeleccionProvincia(idProvincia){            
        this.provinciasService.getOne(idProvincia, this.tokenUserApi.access_token).subscribe(
          res => {            
            this.provinciaNueva = res;                                      
            this.cantones = [];
            this.distritos = [];      
            // this.distrito.codDistrito = 0;            
            this.provinciaNueva.cantones.forEach(element => {              
              this.cantones.push(element);
            });
          },
          err => {
            this.notificacionesService.mostrarNotificacionError("<stong>ERROR!!!</strong>", err.message);            
          }
        );      
  }

  cambiaSeleccionCanton(idCanton){        
    this.cantonesService.getCanton(idCanton, this.tokenUserApi.access_token).subscribe(
      res => {
        this.distritos = [];
        // this.distrito.codDistrito = 0;
        this.cantonNuevo = res;
        this.cantonNuevo.distritos.forEach(element => {
          this.distritos.push(element);
        });
      },
      err => {
        console.log(err);
        this.notificacionesService.mostrarNotificacionError("<stong>ERROR!!!</strong>", err.message);             
      }
    );    
  }

  cambiaSeleccionDistrito(idDistrito){
    this.personaDTO.distrito = idDistrito;    
  }

  cambiaSeleccionTipoIdentificacion(){
    this.itemForm.controls['identificacion'].enable();
  }

  tournament: any = {venue:{address: 'Costa Rica'}};
  @ViewChild('search')
  public searchElementRef: ElementRef;

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

  markers: marker[] = [
	  {
		  lat: this.mapCenter.lat,
		  lng: this.mapCenter.lng,
		  draggable: true
	  }
  ]

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

  submit() {
    this.personaDTO.identificacion = this.itemForm.controls.identificacion.value;
    this.personaDTO.nombre = this.itemForm.controls.nombre.value;
    this.personaDTO.apellidos = this.itemForm.controls.apellidos.value;
    this.personaDTO.telefono1 = this.itemForm.controls.telefono1.value;
    this.personaDTO.telefono2 = this.itemForm.controls.telefono2.value;
    this.personaDTO.correoElectronico = this.itemForm.controls.correoElectronico.value;
    this.personaDTO.comentarios = this.itemForm.controls.comentarios.value;
    this.personaDTO.fechaCumpleannos = this.itemForm.controls.fechaCumpleanos.value;
    this.personaDTO.distrito = this.distrito.codDistrito;
    this.personaDTO.estaActivo = this.itemForm.controls.estaActivo.value;
    this.personaDTO.direccion = this.secondFormGroup.controls.direccion.value;
    this.personaDTO.latLongDireccion = this.secondFormGroup.controls.latLongDireccion.value;
    this.personaDTO.maxCredito = this.secondFormGroup.controls.maxCredito.value;
    this.personaDTO.saldoFavor = this.secondFormGroup.controls.saldoFavor.value;
    this.personaDTO.telefonoRef = this.thirdFormGroup.controls.telefonoRef.value;
    this.personaDTO.contactoRef = this.thirdFormGroup.controls.contactoRef.value;
    this.personaDTO.termino = this.termino.idTermino;
    this.personaDTO.otrasSenas = this.secondFormGroup.controls.otrasSenas.value; 

    // console.log(this.itemForm.controls.otrasSenas.value);

    if(this.esEditar){
      this.personasService.update(this.tokenUserApi.access_token, this.personaDTO.identificacion, this.personaDTO).subscribe(
        res => {          
          this.dialogRef.close(this.personaDTO);          
        },
        err => {
          console.log(err); 
          this.snack.open(err.message, "ERROR", { duration: 4000 });                   
        }
      );
    }else{
      this.funcionesService.validaClienteExiste(this.tokenUserApi.access_token, this.personaDTO.identificacion).subscribe(
        res =>{
          this.validaPersona = res[0];        
          if(this.validaPersona.clienteexiste == 0){            
            this.personasService.newRow(this.tokenUserApi.access_token, this.personaDTO).subscribe(
              res => {                
                this.dialogRef.close(this.personaDTO);
              },
              err => {
                this.snack.open(err.message, "ERROR", { duration: 4000 });                       
              }
            );          
          }else{
            this.snack.open("El cliente ya existe", "Atención!!", { duration: 4000 });                   
          }
        },
        err =>{
         this.snack.open(err.message, "ERROR", { duration: 4000 });         
        }
      );    
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
  clienteexiste: number
}
