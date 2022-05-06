import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonaDto } from 'app/interfaces/dto/persona-dto';
import { Token } from 'app/interfaces/token';
import { FuncionesService } from 'app/services/funciones.service';
import { PersonaService } from 'app/services/persona.service';
import { UserApiService } from 'app/services/user-api.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
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
    codigoResponsable: null
  }

  tokenUserApi: Token = {
    access_token: ``
  }

  public items: any[];
  public temp = [];

  constructor(
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private snack: MatSnackBar,    
    private personasService: PersonaService,
    private userApiService: UserApiService,
    private funcionesService: FuncionesService,
    private confirmService: AppConfirmService
  ) { }

  ngOnInit(): void {
    this.userApiService.login().subscribe(
      res => {
          this.tokenUserApi = res;                           
          this.getItems();    
      },
      err => {
          this.snack.open(err.message, "ERROR", { duration: 4000 });
      }
    );    
  }

  getItems() {
    this.loader.open();
    this.funcionesService.obtenerEmpleados(this.tokenUserApi.access_token).subscribe(
      res => {
        this.items = this.temp = res;
        console.log(res);
        this.loader.close();
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 4000 });
      }
    );
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Empleado' : 'Modificar Empleado';
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
          this.snack.open("El empleado fue creado con éxito", "ÉXITO", { duration: 4000 });                       
          this.getItems();                    
        } else {          
          this.snack.open("El empleado fue editado con éxito", "ÉXITO", { duration: 4000 });                       
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

          this.personasService.update(this.tokenUserApi.access_token, this.personaDTO.identificacion, this.personaDTO).subscribe(
            res => {
              this.snack.open('Cliente desactivado!', 'OK', { duration: 4000 })
              this.getItems();
              this.loader.close();
            },
            err => {
              console.log(err);
              this.snack.open(err.message, "ERROR", { duration: 4000 });                                     
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

}
