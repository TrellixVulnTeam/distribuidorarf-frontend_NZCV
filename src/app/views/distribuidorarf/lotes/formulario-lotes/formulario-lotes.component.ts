import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ProductosService } from 'app/services/productos.service';
import { Producto } from 'app/interfaces/producto';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserApiService } from 'app/services/user-api.service';
import { Token } from 'app/interfaces/token';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DetalleProductoLotePopupComponent } from './detalle-producto-lote-popup/detalle-producto-lote-popup.component';
import { DetalleLoteDto } from 'app/interfaces/dto/detalle-lote-dto';
import { LoteDto } from 'app/interfaces/dto/lote-dto';
import { LotesService } from 'app/services/lotes.service';
import { Lote } from 'app/interfaces/lote';
import { DetallesLoteService } from 'app/services/detalles-lote.service';
import { Router } from '@angular/router';
import { Persona } from 'app/interfaces/persona';
import { FuncionesService } from 'app/services/funciones.service';
import { CreacionRapidaProductoComponent } from '../../productos/creacion-rapida-producto/creacion-rapida-producto.component';
import { StringManager } from 'app/managers/string-manager';
import { ServiceManager } from 'app/managers/service-manager';
import { ErrorBk } from 'app/interfaces/error-bk';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { environment } from 'environments/environment';

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
  listaEmpleados: Persona[] = [];
  moneda: string = "CRC";
  tipoCambio: number = 0;

  lote: LoteDto = {
    cantidadTotal: null,
    codigoLote: null,
    codigoResponsable: null,
    costoTotal: null,
    descripcion: null,
    fase: null,
    fecha: null,
    moneda: null,
    tipoCambio: null
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
    fechaUltimaModificacion: null,
    moneda: null,
    tipoCambio: null
  }

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
    private fb: FormBuilder,
    private productosService: ProductosService,
    private loader: AppLoaderService,
    private snack: MatSnackBar,        
    private tokenService: UserApiService,
    private dialog: MatDialog,
    private lotesService: LotesService,
    private detallesLoteService: DetallesLoteService,
    private route: Router,
    private funcionesService: FuncionesService
  ) { }

  ngOnInit(): void {
    this.loader.open();
    this.buildItemForm('');                               
    this.loadProducts();    
    this.cargarEmpleados();     
  }

  buildItemForm(item){
    this.datosInicialesForm = this.fb.group({            
      descripcion: [item.descripcion || '', Validators.required],
      fechaLote: [item.fecha || '', [Validators.required]],
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
    this.items = [];
    this.temp = [];
    this.productosService.getAll().subscribe(
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
                  this.loadProducts();
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

  updateProductFilter(event){
    const val = event.target.value.toLowerCase();    
    var columns = Object.keys(this.temp[0]);
    // Removes last "$$index" from "column"
    columns.splice(columns.length - 1);    
    
    if (!columns.length)
      return;

    const rows = this.temp.filter(function(d) {
      for (let i = 0; i <= columns.length; i++) {
        let column = columns[i];
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
    if (!columns.length)
      return;

    const rows = this.tempLot.filter(function(d) {
      for (let i = 0; i <= columns.length; i++) {
        let column = columns[i];
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
  compocision: string = '';

  addToLot(data: any = {}){    
    let product = data;
    let tempList: DetalleLoteDto[] = [];    
    let tempListItems: Producto[] = [];   
    
    const dialogRef = this.dialog.open(DetalleProductoLotePopupComponent, {      
      data: {cantidad: this.cantidad, precioUnitario: this.precioUnitario, precioTotal: this.precioTotal, compocicion: this.compocision}
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
        idDetalleLote: null,
        descripcion: product.nombre,
        composicion: result.composicion,
        costo: result.precioUnitario,
        cantidad: result.cantidad,
        precioTotal: result.precioTotal,
        producto: product.idProducto,
        codigoResponsable: this.datosInicialesForm.controls.autorizacionEmpleado.value,
        lote: null,
        cantidadAsignada: null        
      }
  
      tempList.push(detalleInsertar);
      
      this.itemsLote.forEach(element => {
        if(element.producto === product.idProducto){
          this.snack.open("Este producto ya se encuentra en el lote", "ATENCIÓN!!", { duration: 4000 });
          return;
        }else{
          tempList.push(element);
        }           
      });    
  
      this.itemsLote = tempList;
    });    
  }

  removeFromLot(data: any = {}){
    let lote = data; 
    let tempList: Producto[] = [];    
    let tempLotList: DetalleLoteDto[] = [];    
    let detalleEliminar: DetalleLoteDto;

    let product = this.itemsProductoEnLote.find(x => x.idProducto === lote.producto);    

    // -- Remove product from itemsProductoEnLote    
    this.itemsProductoEnLote.splice(this.itemsProductoEnLote.findIndex(x => x.idProducto === lote.product));

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
    if(this.empleadoConAutrizacion(this.datosInicialesForm.controls.autorizacionEmpleado.value) != true){
      this.snack.open("Código de autoriazión inválido.", "ERROR!!", { duration: 4000 }); 
    }else{
      this.crearLote();
      this.lotesService.newRow(this.lote).subscribe(
        res => {
          this.loteInsertado = res;
          this.actualizaDetallesLote(this.loteInsertado.codigoLote);
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
                    this.submit();
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
  }

  empleadoConAutrizacion(codigo){
    let autorizado = false;    
    this.listaEmpleados.forEach(element => {      
      if(element.codigoAutorizacion === codigo){
        autorizado = true;
        return autorizado;
      }      
    });

    return autorizado;
  }

  crearLote(){
    this.lote.cantidadTotal = this.cantidadTotal;
    this.lote.codigoResponsable = this.datosInicialesForm.controls.autorizacionEmpleado.value;
    this.lote.costoTotal = this.costoTotal;
    this.lote.descripcion = this.datosInicialesForm.controls.descripcion.value;
    this.lote.fase = this.fase == 'Nuevo' ? 1 : -1;    
    this.lote.fecha = this.datosInicialesForm.controls.fechaLote.value;
    this.lote.moneda = this.moneda;
    this.lote.tipoCambio = this.tipoCambio;
  }

  cargarEmpleados(){
    this.funcionesService.obtenerEmpleados().subscribe(
      res => {
        this.listaEmpleados = res;
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
                  this.cargarEmpleados();
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

  actualizaDetallesLote(codigoLote: number){
    
    let cantidadDetalles: number = this.itemsLote.length;
    let cantidadActual: number = 1;
    
    this.itemsLote.forEach(element => {
      element.lote = codigoLote;      
      element.idDetalleLote = codigoLote + element.producto;
      console.log(element);
      this.detallesLoteService.newRow(element).subscribe(
        res => {
          if(cantidadActual === cantidadDetalles){
            this.route.navigateByUrl('/distribuidorarf/lots');  
          }
          cantidadActual += 1;
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
                    this.loadProducts();
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
    });
  }

  crearProductoRapido(data: any){
    let title: string = "Creación Rápida de Producto";
    let dialogRef: MatDialogRef<any> = this.dialog.open(CreacionRapidaProductoComponent, {
      maxWidth: '80vw',
      maxHeight: '90vh',
      disableClose: true,
      data: { title: title, payload: data }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }else{
          this.loadProducts();
        }
      }
    );
  }

}
