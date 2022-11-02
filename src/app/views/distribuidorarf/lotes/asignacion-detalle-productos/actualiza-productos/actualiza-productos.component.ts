import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DetalleLote } from 'app/interfaces/detalle-lote';
import { DetalleProductoLote } from 'app/interfaces/detalle-producto-lote';
import { DetalleLoteDto } from 'app/interfaces/dto/detalle-lote-dto';
import { ErrorBk } from 'app/interfaces/error-bk';
import { Persona } from 'app/interfaces/persona';
import { Producto } from 'app/interfaces/producto';
import { Token } from 'app/interfaces/token';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { StringManager } from 'app/managers/string-manager';
import { DetallesLoteService } from 'app/services/detalles-lote.service';
import { FuncionesService } from 'app/services/funciones.service';
import { ProcedimientosDbService } from 'app/services/procedimientos-db.service';
import { ProductosService } from 'app/services/productos.service';
import { UserApiService } from 'app/services/user-api.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { environment } from 'environments/environment';
import { DetalleProductoLotePopupComponent } from '../../formulario-lotes/detalle-producto-lote-popup/detalle-producto-lote-popup.component';

@Component({
  selector: 'app-actualiza-productos',
  templateUrl: './actualiza-productos.component.html',
  styleUrls: ['./actualiza-productos.component.scss']
})
export class ActualizaProductosComponent implements OnInit {

  public itemForm: FormGroup;
  listaEmpleados: Persona[] = [];  
  token: Token = {
    access_token: null
  };
  items: Producto[] = [];
  itemsDetalle: DetalleLote[] = [];
  itemsLote: DetalleLoteDto[] = [];
  itemsProductoEnLote: Producto[] = [];
  public temp = [];
  public tempLot = [];
  cantidadTotal: number = 0;
  costoTotal: number = 0;
  cantidad: number = 0;
  precioUnitario: number = 0;
  precioTotal: number = 0;

  error: ErrorBk = {
    statusCode: null,
    message: null
  };
  intentos = 0;
  serviceManager = ServiceManager;
  strings = StringManager;

  constructor(
    private tokenService: UserApiService,
    private snack: MatSnackBar, 
    private funcionesService: FuncionesService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ActualizaProductosComponent>,
    private fb: FormBuilder,
    private productosService: ProductosService,
    private loader: AppLoaderService,
    private detallesLoteService: DetallesLoteService,
    private dialog: MatDialog,
    private procedimientosDBService: ProcedimientosDbService
  ) { }

  ngOnInit(): void {
    this.loader.open();
    this.buildItemForm();    
    this.cargarEmpleados();
    this.cargarDetallesLote(this.data.payload.codigoLote);        
    this.loadProducts();                          
  }  

  loadProducts(){
    this.productosService.getAll().subscribe(
      res => {
        let temporal: Producto[] = [];        
        temporal = res;
        let itemsTemp: Producto[] = [];
        temporal.forEach(element => {
          let detalleActual: DetalleLoteDto = null;
          detalleActual = this.itemsLote.find(x => x.producto == element.idProducto);

          if(detalleActual == null){
            itemsTemp.push(element);
          }
          
        });

        this.items = this.temp = itemsTemp;
        this.loader.close();
      },
      err => {
        this.error = err.error;
        if(this.intentos = this.serviceManager.MAX_INTENTOS){
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

  cargarDetallesLote(codigoLote){
    this.loader.open();
    this.detallesLoteService.getAll(codigoLote).subscribe(
      res => { 
        this.itemsDetalle = res;        
        let tempList: DetalleLoteDto[] = [];    
        this.itemsDetalle.forEach(element => {
          // Creo un obejto de tipo Detalle Lote DTO 
          let detalleInsertar: DetalleLoteDto = {
            cantidad: element.cantidad,
            codigoResponsable: element.codigoResponsable,
            composicion: element.composicion,
            costo: element.costo,
            descripcion: element.descripcion,
            idDetalleLote: element.idDetalleLote,
            lote: element.lote.codigoLote,
            precioTotal: element.precioTotal,
            producto: element.producto.idProducto,
            cantidadAsignada: element.cantidadAsignada
          }
      
          tempList.push(detalleInsertar);
        });
        this.itemsLote = this.tempLot = tempList;            
        this.loader.close();
      },
      err => {
        this.error = err.error;
        if(this.intentos = this.serviceManager.MAX_INTENTOS){
          this.snack.open(this.strings.error_mgs_cantidad_intentos, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });
        }else{
          if(this.error.statusCode == 401){
            this.intentos += 1;
            this.tokenService.login().subscribe(
              res => {
                  this.token = res;
                  LocalStorageManger.setToken(this.token.access_token);
                  this.intentos = 1;
                  this.cargarDetallesLote(codigoLote);
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

  empleadoConAutrizacion(){
    let autorizado = false;    
    this.listaEmpleados.forEach(element => {      
      if(element.codigoAutorizacion === this.itemForm.controls.autorizacionEmpleado.value){
        autorizado = true;
        return autorizado;
      }      
    });

    return autorizado;
  }

  buildItemForm() {            
    this.itemForm = this.fb.group({            
      autorizacionEmpleado: ['', Validators.required]   
    });
  }

  cargarEmpleados(){
    this.funcionesService.obtenerEmpleados().subscribe(
      res => {
        this.listaEmpleados = res;
      },
      err => {
        this.error = err.error;
        if(this.intentos = this.serviceManager.MAX_INTENTOS){
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

  submit(){
    if(this.empleadoConAutrizacion() != true){
      this.snack.open("Código de autorización inválido.", "ERROR!!", { duration: 4000 }); 
    }else{
      this.actualizaDetallesLote(this.data.payload.codigoLote);      
    }
  }

  actualizaDetallesLote(codigoLote: number){
    let cantidadDetalles: number = this.itemsLote.length;
    let cantidadActual: number = 1;
    
    this.itemsLote.forEach(element => {
      element.lote = codigoLote;      
      element.idDetalleLote = codigoLote + element.producto;
      this.detallesLoteService.newRow(element).subscribe(
        res => {
          if(cantidadActual === cantidadDetalles){
            this.procedimientosDBService.actualizaCostoLote(this.data.payload.codigoLote).subscribe(
              res => {
                let respuesta = res;
                return this.dialogRef.close(this.itemsLote);
              },
              err => {
                this.error = err.error;
                if(this.intentos = this.serviceManager.MAX_INTENTOS){
                  this.snack.open(this.strings.error_mgs_cantidad_intentos, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });
                }else{
                  if(this.error.statusCode == 401){
                    this.intentos += 1;
                    this.tokenService.login().subscribe(
                      res => {
                          this.token = res;
                          LocalStorageManger.setToken(this.token.access_token);
                          this.intentos = 1;
                          this.actualizaDetallesLote(codigoLote);
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
          cantidadActual += 1;
        },
        err => {
          this.error = err;
          if(this.intentos = this.serviceManager.MAX_INTENTOS){
            this.snack.open(this.strings.error_mgs_cantidad_intentos, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });
          }else{
            if(this.error.statusCode == 401){
              this.intentos += 1;
              this.tokenService.login().subscribe(
                res => {
                    this.token = res;
                    LocalStorageManger.setToken(this.token.access_token);
                    this.intentos = 1;
                    this.actualizaDetallesLote(codigoLote);
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

  composicion: string = '';

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
        idDetalleLote: null,
        descripcion: product.nombre,
        composicion: result.composicion,
        costo: result.precioUnitario,
        cantidad: result.cantidad,
        precioTotal: result.precioTotal,
        producto: product.idProducto,
        codigoResponsable: this.itemForm.controls.autorizacionEmpleado.value,
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

    try {
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
    } catch (error) {
      this.snack.open("En esta pantalla. No puede eliminar productos previamente ingresados", "ERROR!!", { duration: 4000 });
    }    

  }

}
