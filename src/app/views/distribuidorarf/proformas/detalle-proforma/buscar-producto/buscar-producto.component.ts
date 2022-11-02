import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionType } from '@swimlane/ngx-datatable';
import { Token } from 'app/interfaces/token';
import { UserApiService } from 'app/services/user-api.service';
import { FuncionesService } from 'app/services/funciones.service';

@Component({
  selector: 'app-buscar-producto',
  templateUrl: './buscar-producto.component.html',
  styleUrls: ['./buscar-producto.component.scss']
})
export class BuscarProductoComponent implements OnInit {

  public itemForm: FormGroup;
  
  columns: any[] = [{prop: 'iddetalleproducto', name: 'Cod. Producto'}, {prop: 'nombre', name:'Nombre'}, {prop: 'talla', name:'Talla'}, {prop: 'cantidadexistencias', name:'Existencias'}, {prop: 'precioventa', name:'Precio'}];
  rows: ProductoResumen[] = [];
  temp: ProductoResumen[] = [];
  productoSeleccionado: ProductoResumen;
  SelectionType = SelectionType;
  selected = [];
  img: string = '';
  token: Token = {
    access_token: null
  }


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BuscarProductoComponent>,
    private fb: FormBuilder,
    private tokenService: UserApiService,
    private funcionesService: FuncionesService
  ) { }

  ngOnInit(): void {
    this.buildItemForm();
    this.buscarProducto();
  }

  buscarProducto(){
    this.funcionesService.listaProductosBusquedaFactura(this.data.precio).subscribe(
      res => {
        this.rows = this.temp = res;
      },
      err => {
        console.log(err);
      }         
    );
  }

  buildItemForm(){
    this.itemForm = this.fb.group({
      codigo: ['']
    });
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
    this.productoSeleccionado = event.selected[0];
    this.img = this.productoSeleccionado.url;
  }

  submit(){
    console.log(this.productoSeleccionado);
    this.dialogRef.close(this.productoSeleccionado);
  }

}

export interface ProductoResumen {
  iddetalleproducto: string;
  idproducto: string;
  nombre: string;
  cantidadexistencias: number;
  url: string;
  precio: number;
  esLiquidacion: boolean;
  porcentdescuento: number;
  talla: string;
}
