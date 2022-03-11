import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ProveedorDto } from 'app/interfaces/dto/proveedor-dto';
import { Token } from 'app/interfaces/token';
import { ProveedoresService } from 'app/services/proveedores.service';
import { UserApiService } from 'app/services/user-api.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { ProveedoresPopupComponent } from './proveedores-popup/proveedores-popup.component';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent implements OnInit {

  public items: any[];
  public temp = [];
  public getItemSub: Subscription;

  token: Token = {
    access_token: ``
  }

  proveedorDTO: ProveedorDto = {
    identificacion: null,
    nombre: null,
    telefono: null,
    tipoIdentificacion: null,
    correoElectronico: null,
    direccion: null,
    comentarios: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    estaActivo: null,
    latLongDireccion: null,
    distrito: null
  }

  columns = [{ prop: 'nombre' }, { name: 'ID' }, { name: 'correoElectronico' }, { name: 'telefono' }];
  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private snack: MatSnackBar,        
    private userApiService: UserApiService,
    private confirmService: AppConfirmService,
    private proveedoresServive: ProveedoresService
  ) { }

  ngOnInit(): void {
    this.userApiService.login().subscribe(
      res => {
          this.token = res;                           
          this.getItems();    
      },
      err => {
          this.snack.open(err.message, "ERROR", { duration: 4000 });
      }
    );    
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe()
    }    
  }

  getItems() {
    this.loader.open();
    this.proveedoresServive.getAll(this.token.access_token).subscribe(
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

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agragar Proveedor' : 'Modificar Proveedor';
    // console.log(console.log("Entra: " + data.distrito.idDistrito));
    let dialogRef: MatDialogRef<any> = this.dialog.open(ProveedoresPopupComponent, {
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
          this.proveedoresServive.getAll(this.token.access_token).subscribe(
            res => {
              this.items = this.temp = res;
              this.loader.close();
              this.snack.open("El proveedor fue editado con éxito", "ÉXITO", { duration: 4000 });                       
            },
            err => {
              this.snack.open(err.message, "ERROR", { duration: 4000 });
            }
          );
        } else {          
          this.proveedoresServive.getAll(this.token.access_token).subscribe(
            res => {
              this.items = this.temp = res;
              this.loader.close();
              this.snack.open("El proveedor fue editado con éxito", "ÉXITO", { duration: 4000 });                       
            },
            err => {
              this.snack.open(err.message, "ERROR", { duration: 4000 });
            }
          );          
        }
      })
  }

}
