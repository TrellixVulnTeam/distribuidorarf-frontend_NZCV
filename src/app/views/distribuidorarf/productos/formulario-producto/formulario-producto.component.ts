import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoDto } from 'app/interfaces/dto/producto-dto';
import { Categoria } from 'app/interfaces/categoria';
import { CategoriasService } from 'app/services/categorias.service';
import { Token } from 'app/interfaces/token';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserApiService } from 'app/services/user-api.service';
import { Proveedor } from 'app/interfaces/proveedor';
import { ProveedoresService } from 'app/services/proveedores.service';
import { MarcasService } from 'app/services/marcas.service';
import { Marca } from 'app/interfaces/marca';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomizerService } from 'app/shared/services/customizer.service';
import { NavigationService } from 'app/shared/services/navigation.service';
import { DetalleProducto } from 'app/interfaces/detalle-producto';
import { isThisISOWeek } from 'date-fns';
import { FileUploader } from 'ng2-file-upload';
 
@Component({
  selector: 'app-formulario-producto',
  templateUrl: './formulario-producto.component.html',
  styleUrls: ['./formulario-producto.component.scss']
})
export class FormularioProductoComponent implements OnInit {

  public datosInicialesForm: FormGroup;
  public preciosForm: FormGroup;
  public detallesForm: FormGroup;
  isLinear = true; 
  color = 'blue';

  categorias: Categoria[] = [];
  proveedores: Proveedor[] = [];
  marcas: Marca[] = [];
  
  productoDTO: ProductoDto = {
    cantidadExistencias: null,
    categoria: null,
    costo: null,
    cantidadMinima: null,
    codigoExterno: null,
    descripcion: null,
    esLiquidacion: null,
    idProducto: null,
    marca: null,
    nombre: null,
    proveedor: null
  }

  token: Token = {
    access_token: ``
  }
  
  public items: any[];
  detallesProducto: DetalleProducto[] = [];

  constructor(
    private categoriasService: CategoriasService,
    private snack: MatSnackBar,
    private userApiService: UserApiService,
    private fb: FormBuilder,
    private proveedoresService: ProveedoresService,
    private marcasService: MarcasService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormularioProductoComponent>    
  ) { }  

  ngOnInit(): void {
    this.buildItemForm(this.data.payload);        
    this.items = this.detallesProducto;
    this.items.push({
      id: -1,
      talla: 'Talla',
      cantidad: 'Cantidad',
      nombreColor: 'Nombre Color',
      color: 'transparent'
    });
    this.items.push({
      id: 1,
      talla: 'S',
      cantidad: '10',
      nombreColor: 'Verde',
      color: 'green'
    });
    this.userApiService.login().subscribe(
      res => {
        this.token = res;       
        this.cargarCategorias();        
        this.cargarProveedores();
        this.cargarMarcas();
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 4000 });
      }
    );    
  }

  buildItemForm(item) {
    this.datosInicialesForm = this.fb.group({            
      idProducto: [item.idProducto || '', Validators.required],
      codigoExterno: [item.codigoExterno || '', Validators.required],
      nombre: [item.nombre || '', Validators.required],
      descripcion: [item.descripcion || ''],
      cantidadExistencias: [item.cantidadExistencias || 0]
    });
    this.preciosForm = this.fb.group({
      esLiquidacion: [item.esLiquidacion || false],
      costo: [item.costo || 0],
      costo1: [item.costo || 0],
      costo2: [item.costo || 0],
      costo3: [item.costo || 0],
      costo4: [item.costo || 0],
      utilidad1: [item.utilidad || 0],
      utilidad2: [item.utilidad || 0],
      utilidad3: [item.utilidad || 0],
      utilidad4: [item.utilidad || 0],
      precioVenta1: [item.precioVenta || 0],
      precioVenta2: [item.precioVenta || 0],
      precioVenta3: [item.precioVenta || 0],
      precioVenta4: [item.precioVenta || 0]
    });
    this.detallesForm = this.fb.group({
      talla: [item.talla || ''],
      cantidad: [item.cantidad || 0],
      colorNombre: [item.colorNombre || '']
    });
  }

  cargarCategorias(){    
    this.categoriasService.getAll(this.token.access_token).subscribe(
      res => {
        this.categorias = res;
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 4000 });
      }
    );
  }

  cargarProveedores(){
    this.proveedoresService.getAll(this.token.access_token).subscribe(
      res => {
        this.proveedores = res;
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 4000 });
      }
    );
  }

  cargarMarcas(){
    this.marcasService.getAll(this.token.access_token).subscribe(
      res => {
        this.marcas = res;
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 4000 });
      }
    );
  }

  agregarDetalle(){
    this.items.push({
      id: 2,
      talla: this.detallesForm.controls.talla.value.toUpperCase(),
      cantidad: this.detallesForm.controls.cantidad.value,
      nombreColor: this.detallesForm.controls.colorNombre.value,
      color: this.color 
    })
  }

  public uploader: FileUploader = new FileUploader({ url: 'https://evening-anchorage-315.herokuapp.com/api/' });
  public hasBaseDropZoneOver: boolean = false;
  console = console;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

}
