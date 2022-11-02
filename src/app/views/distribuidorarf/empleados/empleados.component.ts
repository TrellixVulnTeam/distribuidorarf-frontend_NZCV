import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonaDto } from 'app/interfaces/dto/persona-dto';
import { ErrorBk } from 'app/interfaces/error-bk';
import { Token } from 'app/interfaces/token';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { StringManager } from 'app/managers/string-manager';
import { FuncionesService } from 'app/services/funciones.service';
import { PersonaService } from 'app/services/persona.service';
import { UserApiService } from 'app/services/user-api.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { environment } from 'environments/environment';
import { EmpleadoPopupComponent } from './empleado-popup/empleado-popup.component';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss']
})
export class EmpleadosComponent implements OnInit {

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
    otrasSenas: null,
    codigoResponsable: null,
    precio: null
  }

  token: Token = {
    access_token: ``
  }

  public items: any[];
  public temp = [];

  strings = StringManager;
  intentos = 0;
  serviceManager = ServiceManager;
  error: ErrorBk = {
    statusCode: null,
    message: null
  };

  constructor(
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private snack: MatSnackBar,    
    private personasService: PersonaService,
    private tokenService: UserApiService,
    private funcionesService: FuncionesService,
    private confirmService: AppConfirmService
  ) { }

  ngOnInit(): void {
    this.getItems();    
  }

  getItems() {
    this.loader.open();
    this.funcionesService.obtenerEmpleados().subscribe(
      res => {
        this.items = this.temp = res;
        this.loader.close();
      },
      err => {
        this.error = err.error;
        if(this.intentos == this.serviceManager.MAX_INTENTOS){
          this.snack.open(this.strings.error_mgs_cantidad_intentos, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });
        }else{
          if(this.error.statusCode == 401){
            this.intentos += 1;
            this.getItems();
          }else{
            this.reintento(err, nombresMetodos.getItems);
          }
        }        
      }
    );
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? this.strings.empleado_agregar : this.strings.empleado_editar;
    let dialogRef: MatDialogRef<any> = this.dialog.open(EmpleadoPopupComponent, {
      width: '1020px',
      disableClose: true,
      data: { title: title, payload: data }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        // this.loader.open();
        if (isNew) {
          this.snack.open(this.strings.empleado_creado, this.strings.success_title, { duration: 4000 });                       
          this.getItems();                    
        } else {          
          this.snack.open(this.strings.empleado_editado, this.strings.success_title, { duration: 4000 });                       
          this.getItems();                             
        }
      })
  }

  deleteItem(row) {
    this.confirmService.confirm({message: `Desea desactivar a ${row.nombre}? Los clientes no pueden ser borrados, solo desactivados, por lo que en cualquier momento lo puede volver a activar.`})
      .subscribe(res => {
        if (res) {
          this.loader.open();

          this.personaDTO.identificacion = row.identificacion;
          this.personaDTO.nombre = row.nombre;
          this.personaDTO.apellidos = row.apellidos;
          this.personaDTO.telefono1 = row.telefono1;
          this.personaDTO.telefono2 = row.telefono2;
          this.personaDTO.correoElectronico = row.correoElectronico;
          this.personaDTO.comentarios = row.comentarios;
          this.personaDTO.fechaCumpleannos = row.fechaCumpleanos;
          this.personaDTO.distrito = row.distrito.codDistrito;
          this.personaDTO.estaActivo = false;
          this.personaDTO.direccion = row.direccion;
          this.personaDTO.latLongDireccion = row.latLongDireccion;
          this.personaDTO.maxCredito = row.maxCredito;
          this.personaDTO.saldoFavor = row.saldoFavor;
          this.personaDTO.telefonoRef = row.telefonoRef;
          this.personaDTO.contactoRef = row.contactoRef;
          this.personaDTO.termino = row.termino.idTermino;
          this.personaDTO.tipoIdentificacion = row.tipoIdentificacion.idTipoIdetificacion;
          this.personaDTO.codigoAutorizacion = row.codigoAutorizacion;
          this.personaDTO.tipoPersona = row.tipoPersona;

          this.personasService.update(this.personaDTO.identificacion, this.personaDTO).subscribe(
            res => {
              this.snack.open('Cliente desactivado!', 'OK', { duration: 4000 })
              this.getItems();
              this.loader.close();
            },
            err => {
              this.reintento(err, nombresMetodos.deleteItem, row);
            }
          );

          // this.crudService.removeItem(row)
          //   .subscribe(data => {
          //     this.items = data;
          //     this.loader.close();
          //     this.snack.open('Member deleted!', 'OK', { duration: 4000 })
          //   })
        }
      })
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
              if(metodo === nombresMetodos.getItems){
                this.getItems();
              }else if(metodo === nombresMetodos.deleteItem){
                this.deleteItem(data);
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

enum nombresMetodos {  
  getItems = 'getItems',
  deleteItem = 'deleteItem',
}