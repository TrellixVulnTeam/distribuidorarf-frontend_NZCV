import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DetalleLote } from 'app/interfaces/detalle-lote';
import { DetalleProducto } from 'app/interfaces/detalle-producto';
import { DetalleProductoLote } from 'app/interfaces/detalle-producto-lote';
import { DetalleProductoLoteDto } from 'app/interfaces/dto/detalle-producto-lote-dto';
import { Lote } from 'app/interfaces/lote';
import { Producto } from 'app/interfaces/producto';
import { Token } from 'app/interfaces/token';
import { DetallesLoteService } from 'app/services/detalles-lote.service';
import { DetallesProductosLoteService } from 'app/services/detalles-productos-lote.service';
import { FuncionesService } from 'app/services/funciones.service';
import { LotesService } from 'app/services/lotes.service';
import { ProcedimientosDbService } from 'app/services/procedimientos-db.service';
import { ProductosService } from 'app/services/productos.service';
import { UserApiService } from 'app/services/user-api.service';
import { ActualizaProductosComponent } from './actualiza-productos/actualiza-productos.component';

@Component({
  selector: 'app-asignacion-detalle-productos',
  templateUrl: './asignacion-detalle-productos.component.html',
  styleUrls: ['./asignacion-detalle-productos.component.scss']
})
export class AsignacionDetalleProductosComponent implements OnInit {

  public itemForm: FormGroup;
  panelOpenState: boolean = false;
  productos: Producto[] = [];
  detallesLote: DetalleLote[] = [];
  detalleProductoLoteInterface: objectoDetalle[] = [];
  listaEmpleados: any[] = [];

  lote: Lote = {
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
    tipoCambio: null,
  }

  producto: Producto = {
    cantidadExistencias: null,
    cantidadMinima: null,
    categoria: null,
    codigoExterno: null,
    codigoResponsable: null,
    costo: null,
    descripcion: null,
    detalles: null,
    detallesProformas: null,
    esLiquidacion: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    idProducto: null,
    imagenes: null,
    kardexes: null,
    marca: null,
    nombre: null,
    precios: null,
    proveedor: null
  }

  token: Token = {
    access_token: ``
  }

  dProductoLote: DetalleProductoLote = {
    cantidad: null,
    detalleLote: null,
    detalleProducto: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null
  }

  dProductoLoteEncontrado: DetalleProductoLote = {
    cantidad: null,
    detalleLote: null,
    detalleProducto: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null
  }

  dProductoLoteDTO: DetalleProductoLoteDto = {
    cantidad: null,
    detalleLote: null,
    detalleProducto: null
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AsignacionDetalleProductosComponent>,
    private fb: FormBuilder,
    private userApiService: UserApiService,
    private snack: MatSnackBar,
    private lotesService: LotesService,
    private productosService: ProductosService,
    private dplService: DetallesProductosLoteService,
    private funcionesService: FuncionesService,
    private dialog: MatDialog,    
    private dlotService: DetallesLoteService,
    private procedimientosDBService: ProcedimientosDbService
  ) { }

  ngOnInit(): void {    
    this.buildItemForm(this.data.payload);
    this.userApiService.login().subscribe(
      res => {          
        this.token = res;
        this.loadProducts();
        this.cargarEmpleados();
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 4000 });
      }
    );
  }

  buildItemForm(item) {            
    this.itemForm = this.fb.group({            
      autorizacionEmpleado: ['', Validators.required]   
    });
  }

  loadProducts(){
    this.lote = null;
    this.detalleProductoLoteInterface = [];
    let dpli: objectoDetalle[] = [];
    
    this.lotesService.getOne(this.token.access_token, this.data.payload.codigoLote).subscribe(
      res => {        
        this.lote = res;        
        let detallesLote: DetalleLote[] = [];
        this.dlotService.getAll(this.token.access_token, this.lote.codigoLote).subscribe(
          res => {
            detallesLote = res;            
            detallesLote.forEach(element => {
              this.productosService.getOne(this.token.access_token, element.producto.idProducto).subscribe(
                res => {
                  this.producto = res;
                  this.productos.push(this.producto);              
                  let arreglo: cantidadDetalle[] = [];              
                  this.producto.detalles.forEach(eDetalleProducto => {
                    arreglo.push({
                      cantidad: 0,
                      idDetalleProducto: eDetalleProducto.idDetalleProducto,
                      idDetalleLote: element.idDetalleLote
                    });              
                  });
    
                  dpli.push({
                    lote: this.lote.codigoLote,
                    idProducto: this.producto.idProducto,
                    nombre: this.producto.nombre,
                    cantidadTotal: element.cantidad,
                    detalles: arreglo,
                    cantidadAsignada: element.cantidadAsignada
                  });  

                  this.detalleProductoLoteInterface = dpli;                  
                },
                err => {
                  this.snack.open(err.message, "ERROR", { duration: 4000 });
                }
              );
            });        
          },
          err => {

          }
        );                
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 4000 });
      }
    );
  }

  expandeDetalle(data: any){                
    
    this.detalleProductoLoteInterface.find(x => x.lote == data.lote && x.idProducto === data.idProducto).detalles.forEach(elementLote => {
      let cant: number = 0;
      console.log(elementLote);
      this.dplService.getOne(this.token.access_token, elementLote.idDetalleProducto, elementLote.idDetalleLote).subscribe(
        res => {
          this.dProductoLote = res;       
          console.log(this.dProductoLote);
          elementLote.cantidad = this.dProductoLote != null ? this.dProductoLote.cantidad : 0;
          cant = this.dProductoLote != null ? cant + this.dProductoLote.cantidad : cant + 0;
          elementLote.cantidad = cant;                      
        },
        err => {
          console.log("Error");
          this.snack.open(err.message, "ERROR", { duration: 4000 });
        }
      );                      
    });                  
  }

  listaActualizar: DetalleProductoLoteDto[] = [];

  submit(){    
    if(this.empleadoConAutrizacion()){      
      this.listaActualizar = this.creaListaActualizar();            
      let cantidadLista: number = this.listaActualizar.length;
      let cantidadActual: number = 0;
      this.listaActualizar.forEach(element => {
        if(element.cantidad > 0){          
          this.dProductoLoteEncontrado = null;
          this.dplService.getOne(this.token.access_token, element.detalleProducto, element.detalleLote).subscribe(
            res => {
              this.dProductoLoteEncontrado = res;
              if(this.dProductoLoteEncontrado == null){
                this.dplService.newRow(this.token.access_token, element).subscribe(
                  res => {
                    this.dProductoLote = res;
                    cantidadActual += 1;
                    if(cantidadActual == cantidadLista){
                      this.procedimientosDBService.actualizaCantidadAsiganaDetalleLote(this.token.access_token, this.lote.codigoLote).subscribe(
                        res => {
                          let respuesta: string = res;
                          this.dialogRef.close("Finalizado");
                        },
                        err => {
                          this.snack.open(err.message, "ERROR", { duration: 4000 });                      
                        }
                      );                      
                    }
                  },
                  err => {
                    this.snack.open(err.message, "ERROR", { duration: 4000 });                
                  }
                );
              }else{
                this.dplService.update(this.token.access_token, element).subscribe(
                  res => {
                    this.dProductoLote = res;
                    cantidadActual += 1;
                    if(cantidadActual == cantidadLista){
                      this.procedimientosDBService.actualizaCantidadAsiganaDetalleLote(this.token.access_token, this.lote.codigoLote).subscribe(
                        res => {
                          let respuesta: string = res;
                          this.dialogRef.close("Detalles Actualizados!!!");
                        },
                        err => {
                          this.snack.open(err.message, "ERROR", { duration: 4000 });                      
                        }
                      );                      
                    }
                  },
                  err => {
                    this.snack.open(err.message, "ERROR", { duration: 4000 });                
                  }
                );
              }
            },
            err => {
              this.snack.open(err.message, "ERROR", { duration: 4000 });                                
            }
          );            
        }else{
          cantidadActual += 1;
          if(cantidadActual == cantidadLista){
            this.dialogRef.close("Detalles Actualizados!!!");
          }          
        }
      });      
    }else{
      this.snack.open("El código de empleado no es correcto. Por favor validarlo y volver a intentarlo.", "ERROR", { duration: 4000 });
    }
  }

  creaListaActualizar(){
    let listaReturn: DetalleProductoLoteDto[] = [];
    this.detalleProductoLoteInterface.forEach(elementDL => {
      elementDL.detalles.forEach(element => {
        listaReturn.push({
          detalleLote: element.idDetalleLote,
          detalleProducto: element.idDetalleProducto,
          cantidad: element.cantidad
        })
      });
    });    
    return listaReturn;
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

  cargarEmpleados(){
    this.funcionesService.obtenerEmpleados(this.token.access_token).subscribe(
      res => {
        this.listaEmpleados = res;
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 4000 });
      }
    );
  }

  agregarProducto(data: any){
    let title: string = "Asigna más productos";
    let dialogRef: MatDialogRef<any> = this.dialog.open(ActualizaProductosComponent, {
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

interface objectoDetalle {
  lote: number,
  idProducto: string,
  nombre: string,
  cantidadTotal: number,
  cantidadAsignada: number,
  detalles: cantidadDetalle[],  
}

interface cantidadDetalle {
  idDetalleProducto: string,
  idDetalleLote: string,
  cantidad: number
}
