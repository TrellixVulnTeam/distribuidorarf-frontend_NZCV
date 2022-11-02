import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorBk } from 'app/interfaces/error-bk';
import { Token } from 'app/interfaces/token';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { StringManager } from 'app/managers/string-manager';
import { CategoriasService } from 'app/services/categorias.service';
import { UserApiService } from 'app/services/user-api.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs';
import { CategoriaPopupComponent } from './categoria-popup/categoria-popup.component';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {

  strings = StringManager;
  public items: any[];
  public temp = [];
  public getItemSub: Subscription;
  error: ErrorBk = {
    statusCode: null,
    message: null
  };

  tokenUserApi: Token = {
    access_token: ``
  }

  constructor(
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private snack: MatSnackBar,        
    private userApiService: UserApiService,
    private confirmService: AppConfirmService,
    private categoriasService: CategoriasService
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
    this.categoriasService.getAll().subscribe(
      res => {
        this.items = this.temp = res;
        this.loader.close();
      },
      err => {    
        this.error = err.error;
        if(this.error.statusCode == 401){
          this.userApiService.login().subscribe(
            res => {
                this.tokenUserApi = res;
                LocalStorageManger.setToken(this.tokenUserApi.access_token);
                this.getItems();
            },
            err => {
                this.loader.close();
                this.snack.open(err.message, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });
            }
          );              
        }else{
          this.loader.close();
          this.snack.open(err.message, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });
        }
      }
    );
  }

  onTreeAction(event: any) {
    const index = event.rowIndex;
    const row = event.row;
    if (row.treeStatus === 'collapsed') {
      row.treeStatus = 'expanded';
    } else {
      row.treeStatus = 'collapsed';
    }
    this.items = [...this.items];
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? this.strings.categoria_agregar : this.strings.categoria_editar;
    let dialogRef: MatDialogRef<any> = this.dialog.open(CategoriaPopupComponent, {
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
          this.categoriasService.getAll().subscribe(
            res => {
              this.items = this.temp = res;
              this.loader.close();
              this.snack.open(this.strings.categoria_creada, this.strings.success_title, { duration: environment.TIEMPO_NOTIFICACION });                       
            },
            err => {
              this.snack.open(err.message, this.strings.error_title , { duration: environment.TIEMPO_NOTIFICACION });
            }
          );
        } else {          
          this.categoriasService.getAll().subscribe(
            res => {
              this.items = this.temp = res;
              this.loader.close();
              this.snack.open(this.strings.categoria_editada, this.strings.success_title, { duration: environment.TIEMPO_NOTIFICACION });                       
            },
            err => {
              this.snack.open(err.message, this.strings.error_title , { duration: environment.TIEMPO_NOTIFICACION });
            }
          );          
        }
      })
    }    

  deleteItem(row) {
    this.confirmService.confirm({message: `${this.strings.categoria_pregunta_eliminar} ${row.nombre} ?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.categoriasService.delete(row.idCategoria).subscribe(
            res => {
              this.snack.open(this.strings.categoria_eliminada, this.strings.ok_title, { duration: environment.TIEMPO_NOTIFICACION })
              this.getItems();
              this.loader.close();
            },
            err => {
              this.snack.open(err.message, this.strings.error_title , { duration: environment.TIEMPO_NOTIFICACION });
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
