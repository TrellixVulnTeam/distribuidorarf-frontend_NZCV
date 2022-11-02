import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionType } from '@swimlane/ngx-datatable';
import { Producto } from 'app/interfaces/producto';
import { Token } from 'app/interfaces/token';
import { ProductosService } from 'app/services/productos.service';
import { UserApiService } from 'app/services/user-api.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.scss']
})
export class BusquedaComponent implements OnInit {

  public itemForm: FormGroup;
  items: Producto[] = [];
  columns: any[] = [{prop: 'idProducto'}, {prop: 'nombre', name:'Nombre'}, {prop: 'descripcion', name:'Descripción'}];
  rows: Producto[] = [];
  temp: Producto[] = [];

  token: Token ={
    access_token: null
  }

  selected = [];
  SelectionType = SelectionType;
  codigoProductoSeleccionado: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BusquedaComponent>,
    private fb: FormBuilder,
    private productosService: ProductosService,
    private tokenService: UserApiService
  ) { }

  ngOnInit(): void {    
    this.buildItemForm();
    this.tokenService.login().subscribe(
      res => {
        this.token = res;        
        this.productosService.getAll().subscribe(
          res => {
            this.rows = this.temp = res;
          },
          err => {
            console.log(err);
          }         
        );
      },
      err => {
        console.log(err);        
      }
    );
  }

  buildItemForm() {
    this.itemForm = this.fb.group({            
      codigo: ['', Validators.required]      
    });
  }

  submit(){
    this.dialogRef.close(this.codigoProductoSeleccionado);
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

    this.rows = rows;
  }

  onSelect(event) {           
    this.codigoProductoSeleccionado = event.selected[0].idProducto;
  }

}
