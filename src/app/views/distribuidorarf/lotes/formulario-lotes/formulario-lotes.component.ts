import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Product } from 'app/shared/models/product.model';
import { ProductosService } from 'app/services/productos.service';
import { Producto } from 'app/interfaces/producto';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserApiService } from 'app/services/user-api.service';
import { Token } from 'app/interfaces/token';
import { MatDialog } from '@angular/material/dialog';
import { DetalleProductoLotePopupComponent } from './detalle-producto-lote-popup/detalle-producto-lote-popup.component';
import { DetalleLote } from 'app/interfaces/detalle-lote';
import { DetalleLoteDto } from 'app/interfaces/dto/detalle-lote-dto';
import { LoteDto } from 'app/interfaces/dto/lote-dto';
import { LotesService } from 'app/services/lotes.service';
import { Lote } from 'app/interfaces/lote';

@Component({
  selector: 'app-formulario-lotes',
  templateUrl: './formulario-lotes.component.html',
  styleUrls: ['./formulario-lotes.component.scss']
})
export class FormularioLotesComponent implements OnInit {

  public datosInicialesForm: FormGroup;
  items: Producto[] = [];
  itemsLote: DetalleLoteDto[] = [];
  itemsProductoEnLote: Producto[] = [];
  public temp = [];
  public tempLot = [];
  cantidadTotal: number = 0;
  costoTotal: number = 0;
  fase: string = 'Nuevo';

  lote: LoteDto = {
    cantidadTotal: null,
    codigoLote: null,
    codigoResponsable: null,
    costoTotal: null,
    descripcion: null,
    fase: null,
    fecha: null
  }

  loteInsertado: Lote = {
    cantidadTotal: null,
    codigoLote: null,
    codigoResponsable: null,
    costoTotal: null,
    descripcion: null,
    detalles: null,
    fase: null,
    fecha: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null
  }

  tokenUserApi: Token = {
    access_token: ``
  }

  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService,
    private loader: AppLoaderService,
    private snack: MatSnackBar,        
    private userApiService: UserApiService,
    public dialog: MatDialog,
    public lotesService: LotesService
  ) { }

  ngOnInit(): void {
    this.loader.open();
    this.buildItemForm('');
    this.userApiService.login().subscribe(
      res => {
          this.tokenUserApi = res;                           
          this.loadProducts();    
      },
      err => {
          this.snack.open(err.message, "ERROR", { duration: 4000 });
      }
    );    
  }

  buildItemForm(item){
    this.datosInicialesForm = this.fb.group({            
      // idProducto: [item.idProducto || '', Validators.required],
      // codigoExterno: [item.codigoExterno || '', Validators.required],
      // nombre: [item.name || '', Validators.required],
      descripcion: [item.descripcion || '', Validators.required],
      fechaLote: [item.fecha || '', [Validators.required]],
      // cantidadExistencias: [item.cantidadExistencias || 0],
      // cantidadMinima: [item.cantidadMinima || 0],
      autorizacionEmpleado: ['', Validators.required]
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  loadProducts(){
    this.productosService.getAll(this.tokenUserApi.access_token).subscribe(
      res => {
        this.items = this.temp = res;
        this.loader.close();
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 4000 });
      }
    );    
  }

  updateProductFilter(event){
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

  updateLotProductFilter(event){
    const val = event.target.value.toLowerCase();    
    var columns = Object.keys(this.tempLot[0]);
    // Removes last "$$index" from "column"
    columns.splice(columns.length - 1);    
    // console.log(columns);
    if (!columns.length)
      return;

    const rows = this.tempLot.filter(function(d) {
      for (let i = 0; i <= columns.length; i++) {
        let column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });

    this.itemsLote = rows;
  }

  cantidad: number = 0;
  precioUnitario: number = 0;
  precioTotal: number = 0;

  addToLot(data: any = {}){    
    let product = data;
    let tempList: DetalleLoteDto[] = [];    
    let tempListItems: Producto[] = [];   
    
    const dialogRef = this.dialog.open(DetalleProductoLotePopupComponent, {      
      data: {cantidad: this.cantidad, precioUnitario: this.precioUnitario, precioTotal: this.precioTotal}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) {
        // If user press cancel
        return;
      }

      // // actualiza cantidad de productos y precio total
      this.cantidadTotal = this.cantidadTotal + result.cantidad;      
      this.costoTotal = this.costoTotal + result.precioTotal;
      
      
      this.items.forEach(element => {
        if(element.idProducto != product.idProducto){
          tempListItems.push(element);
        }      
      });

      // Esta lista se incrementa cada vez que se inserta un producto nuevo en  lote
      this.itemsProductoEnLote.push(product);
      // Asigna a items de productos todos los productos excepto el recien insertado en el lote
      this.items = tempListItems;

      // Creo un obejto de tipo Detalle Lote DTO 
      let detalleInsertar: DetalleLoteDto = {
        descripcion: product.nombre,
        composicion: null,
        costo: result.precioUnitario,
        cantidad: result.cantidad,
        precioTotal: result.precioTotal,
        producto: product.idProducto,
        codigoResponsable: this.datosInicialesForm.controls.autorizacionEmpleado.value,
        lote: null        
      }

      console.log(detalleInsertar);
  
      tempList.push(detalleInsertar);
      
      this.itemsLote.forEach(element => {
        if(element.producto === product.idProducto){
          this.snack.open("Este producto ya se encuentra en el lote", "ATENCIÓN!!", { duration: 4000 });
          return;
        }else{
          tempList.push(element);
        }           
      });    

      console.log(tempList);
  
      this.itemsLote = tempList;
    });    
  }

  removeFromLot(data: any = {}){
    let lote = data; 
    let tempList: Producto[] = [];    
    let tempLotList: DetalleLoteDto[] = [];    
    let detalleEliminar: DetalleLoteDto;

    let product = this.itemsProductoEnLote.find(x => x.idProducto === lote.producto);
    console.log(product);

    // -- Remove product from itemsProductoEnLote    
    this.itemsProductoEnLote.splice(this.itemsProductoEnLote.findIndex(x => x.idProducto === lote.product));
    console.log(this.itemsProductoEnLote);

    // Remove the product from lot list
    this.itemsLote.forEach(element => {
      if(element.producto != product.idProducto){
        tempLotList.push(element);
      }else{
        detalleEliminar = element;
      }
    });

    this.itemsLote = tempLotList;

    // Add product to products list
    tempList.push(product);

    this.items.forEach(element =>{
      tempList.push(element);
    });

    this.items = tempList;

    // // actualiza cantidad de productos y precio total
    this.cantidadTotal = this.cantidadTotal - detalleEliminar.cantidad;      
    this.costoTotal = this.costoTotal - detalleEliminar.precioTotal;

  }

  submit(){
    this.crearLote();
    this.lotesService.newRow(this.tokenUserApi.access_token, this.lote).subscribe(
      res => {
        this.loteInsertado = res;
        this.actualizaDetallesLote(this.loteInsertado.codigoLote);
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 4000 });
      }
    );
  }

  crearLote(){
    this.lote.cantidadTotal = this.cantidadTotal;
    this.lote.codigoResponsable = this.datosInicialesForm.controls.autorizacionEmpleado.value;
    this.lote.costoTotal = this.costoTotal;
    this.lote.descripcion = this.datosInicialesForm.controls.autorizacionEmpleado.value;
    this.lote.fase = this.fase == 'Nuevo' ? 1 : -1;    
    this.lote.fecha = this.datosInicialesForm.controls.fecha.value;
  }

  actualizaDetallesLote(codigoLote: number){
    let cantidadDetalles: number = this.itemsLote.length;
    let cantidadActual: number = 1;
    this.itemsLote.forEach(element => {
      element.lote = codigoLote;      
    });
  }

}
