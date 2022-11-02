import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorBk } from 'app/interfaces/error-bk';
import { Token } from 'app/interfaces/token';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { StringManager } from 'app/managers/string-manager';
import { MarcasService } from 'app/services/marcas.service';
import { UserApiService } from 'app/services/user-api.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs';
import { MarcaPopupComponent } from './marca-popup/marca-popup.component';

@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.scss']
})
export class MarcasComponent implements OnInit {

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

  constructor(
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private snack: MatSnackBar,        
    private tokenService: UserApiService,
    private confirmService: AppConfirmService,
    private marcasService: MarcasService
  ) { }

  ngOnInit(): void {
    this.getItems();        
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe()
    }    
  }

  getItems(){
    this.loader.open();
    this.marcasService.getAll().subscribe(
      res => {
        this.items = this.temp = res;
        this.loader.close();
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
                  this.getItems();
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

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agragar Marca' : 'Modificar Marca';
    let dialogRef: MatDialogRef<any> = this.dialog.open(MarcaPopupComponent, {
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
          this.marcasService.getAll().subscribe(
            res => {
              this.items = this.temp = res;
              this.loader.close();
              this.snack.open("Marca creada con éxito", "ÉXITO", { duration: 4000 });                       
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
                        this.openPopUp(data, isNew);
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
        } else {          
          this.marcasService.getAll().subscribe(
            res => {
              this.items = this.temp = res;
              this.loader.close();
              this.snack.open("Marca editada con éxito", "ÉXITO", { duration: 4000 });                       
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
                        this.openPopUp(data, isNew);
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
      })
  }    

  deleteItem(row) {
    this.confirmService.confirm({message: `Desea eliminar la marca ${row.nombre} ?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.marcasService.delete(row.idMarca).subscribe(
            res => {
              this.snack.open('Marca eliminada correctamente!', 'OK', { duration: 4000 })
              this.getItems();
              this.loader.close();
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
                        this.deleteItem(row);
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

}
