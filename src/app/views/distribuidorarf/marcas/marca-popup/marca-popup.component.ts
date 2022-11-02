import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MarcaDto } from 'app/interfaces/dto/marca-dto';
import { ErrorBk } from 'app/interfaces/error-bk';
import { Marca } from 'app/interfaces/marca';
import { Token } from 'app/interfaces/token';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { StringManager } from 'app/managers/string-manager';
import { FuncionesService } from 'app/services/funciones.service';
import { MarcasService } from 'app/services/marcas.service';
import { UserApiService } from 'app/services/user-api.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-marca-popup',
  templateUrl: './marca-popup.component.html',
  styleUrls: ['./marca-popup.component.scss']
})
export class MarcaPopupComponent implements OnInit {

  public itemForm: FormGroup;
  esEditar: boolean = false;
  marcas: Marca[] = [];
  listaEmpleados: any[] = [];

  marcaDTO: MarcaDto = {
    descripcion: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    idMarca: null,
    nombre: null,
    codigoResponsable: null
  }

  marca: Marca = {
    descripcion: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    idMarca: null,
    nombre: null,
    codigoResponsable: null
  }

  token: Token = {
    access_token: ``
  }

  error: ErrorBk = {
    statusCode: null,
    message: null
  };
  intentos = 0;
  serviceManager = ServiceManager;
  strings = StringManager;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MarcaPopupComponent>,
    private fb: FormBuilder,
    private tokenService: UserApiService,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private marcasService: MarcasService,
    private funcionesService: FuncionesService,
  ) { }

  ngOnInit(): void {
    this.buildItemForm(this.data.payload);  
    this.cargarEmpleados();
    if(this.data.payload.idMarca != '' && this.data.payload.idMarca != null){      
      this.marcaDTO.idMarca = this.data.payload.idMarca;
      this.esEditar = true;
    }                     
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({            
      nombre: [item.nombre || '', Validators.required],
      descripcion: [item.descripcion || ''],      
      autorizacionEmpleado: ['', Validators.required]
    });
  }

  submit() {    
    if(this.empleadoConAutrizacion()){
      this.finalizarProceso();
    }else{
      this.snack.open("El código de empleado no es correcto. Por favor validarlo y volver a intentarlo.", "ERROR", { duration: 4000 });         
    }
  }

  finalizarProceso(){
    this.marcaDTO.nombre = this.itemForm.controls.nombre.value;
    this.marcaDTO.descripcion = this.itemForm.controls.descripcion.value;        
    this.marcaDTO.codigoResponsable = this.itemForm.controls.autorizacionEmpleado.value;        
    if(this.esEditar){
      this.marcasService.update(this.marcaDTO.idMarca, this.marcaDTO).subscribe(
        res => {
          this.marca = res;
          this.dialogRef.close(this.marca);         
        },
        err => {
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
                    this.finalizarProceso();
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
      );
    }else{
      this.marcasService.newRow(this.marcaDTO).subscribe(
        res => {
          this.marca = res;
          this.dialogRef.close(this.marca);         
        },
        err => {
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
                    this.finalizarProceso();
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
        this.listaEmpleados = res;
        console.log(this.listaEmpleados);
      },
      err => {
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
                  this.cargarEmpleados();
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
    );
  }
}
