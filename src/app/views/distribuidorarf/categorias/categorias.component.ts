import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Token } from 'app/interfaces/token';
import { CategoriasService } from 'app/services/categorias.service';
import { UserApiService } from 'app/services/user-api.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { CategoriaPopupComponent } from './categoria-popup/categoria-popup.component';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {

  public items: any[];
  public temp = [];
  public getItemSub: Subscription;

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

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe()
    }    
  }

  getItems(){
    this.categoriasService.getAll(this.tokenUserApi.access_token).subscribe(
      res => {
        this.items = this.temp = res;
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 4000 });
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
    let title = isNew ? 'Agragar Categoría' : 'Modificar Categoría';
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
          this.categoriasService.getAll(this.tokenUserApi.access_token).subscribe(
            res => {
              this.items = this.temp = res;
              this.loader.close();
              this.snack.open("Categoría creada con éxito", "ÉXITO", { duration: 4000 });                       
            },
            err => {
              this.snack.open(err.message, "ERROR", { duration: 4000 });
            }
          );
        } else {          
          this.categoriasService.getAll(this.tokenUserApi.access_token).subscribe(
            res => {
              this.items = this.temp = res;
              this.loader.close();
              this.snack.open("Categoría editada con éxito", "ÉXITO", { duration: 4000 });                       
            },
            err => {
              this.snack.open(err.message, "ERROR", { duration: 4000 });
            }
          );          
        }
      })
  }    

  deleteItem(row) {
    this.confirmService.confirm({message: `Desea eliminar la categoría ${row.nombre} ?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.categoriasService.delete(this.tokenUserApi.access_token, row.idCategoria).subscribe(
            res => {
              this.snack.open('Categoría eliminada correctamente!', 'OK', { duration: 4000 })
              this.getItems();
              this.loader.close();
            },
            err => {
              console.log(err);
              this.snack.open(err.message, "ERROR", { duration: 4000 });                                     
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
