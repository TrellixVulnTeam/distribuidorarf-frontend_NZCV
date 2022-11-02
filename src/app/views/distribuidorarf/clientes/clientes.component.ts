import { S } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { PersonaDto } from 'app/interfaces/dto/persona-dto';
import { Token } from 'app/interfaces/token';
import { UserApi } from 'app/interfaces/user-api';
import { PersonaService } from 'app/services/persona.service';
import { UserApiService } from 'app/services/user-api.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { ClientePopupComponent } from './cliente-popup/cliente-popup.component';
import * as XLSX from 'xlsx';
import { ErrorBk } from 'app/interfaces/error-bk';
import { StringManager } from 'app/managers/string-manager';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { LocalStorageManger } from 'app/managers/local-storage-manger';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit, OnDestroy {

  public items: any[];
  public temp = [];
  public getItemSub: Subscription;

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

  columns = [{ prop: 'nombre' }, { name: 'ID' }, { name: 'apellidos' }, { name: 'maxCredito' }];
  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(    
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private snack: MatSnackBar,    
    private personasService: PersonaService,
    private tokenService: UserApiService,
    private confirmService: AppConfirmService,
  ) {         
  }

  ngOnInit() {    
    this.getItems();
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe()
    }    
  }
  getItems() {
    this.loader.open();    
    this.personasService.getAll().subscribe(
      res => {
        this.items = this.temp = res;
        this.loader.close();
      },
      err => {
        this.reintento(err, nombresMetodos.getItems);
      }
    );
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Cliente' : 'Modificar Cliente';
    let dialogRef: MatDialogRef<any> = this.dialog.open(ClientePopupComponent, {
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
        this.loader.open();
        if (isNew) {
          this.personasService.getAll().subscribe(
            res => {
              this.items = res;
              this.loader.close();
              this.snack.open("El cliente fue creado con éxito", "ÉXITO", { duration: 4000 });                       
            },
            err => {
              this.reintento(err, nombresMetodos.openPopUp, data, isNew);
            }
          );
        } else {          
          this.personasService.getAll().subscribe(
            res => {
              this.items = res;
              this.loader.close();
              this.snack.open("El cliente fue editado con éxito", "ÉXITO", { duration: 4000 });                       
            },
            err => {
              this.reintento(err, nombresMetodos.openPopUp, data, isNew);
            }
          );          
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

  updateFilter(event) {
    const val = event.target.value.toLowerCase();    
    var columns = Object.keys(this.temp[0]);
    // Removes last "$$index" from "column"
    columns.splice(columns.length - 1);    

    // console.log(columns);
    if (!columns.length)
      return;

    const rows = this.temp.filter(function(d) {
      for (let i = 0; i <= columns.length; i++) {
        let column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });

    this.items = rows;
  }

  fileName= 'Clientes.xlsx';
  exportexcel(): void
  {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
 
  }

  reintento(err: any, metodo: string, data?: any, isNew?: boolean, url?: string, id?: number){    
    this.error = err.error;
    console.log(this.error);
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
              }else if(metodo === nombresMetodos.openPopUp){
                this.openPopUp(data, isNew);
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
  openPopUp = 'openPopUp',
  deleteItem = 'deleteItem',
}
