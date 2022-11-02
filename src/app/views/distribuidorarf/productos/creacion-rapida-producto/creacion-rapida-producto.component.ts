import { E } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Categoria } from 'app/interfaces/categoria';
import { ImagenProductoDto } from 'app/interfaces/dto/imagen-producto-dto';
import { PrecioProductoDto } from 'app/interfaces/dto/precio-producto-dto';
import { ProductoDto } from 'app/interfaces/dto/producto-dto';
import { ErrorBk } from 'app/interfaces/error-bk';
import { ImagenProducto } from 'app/interfaces/imagen-producto';
import { CodigosProducto } from 'app/interfaces/interfaces-funciones/codigos-producto';
import { Marca } from 'app/interfaces/marca';
import { PrecioProducto } from 'app/interfaces/precio-producto';
import { Producto } from 'app/interfaces/producto';
import { Proveedor } from 'app/interfaces/proveedor';
import { Token } from 'app/interfaces/token';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { StringManager } from 'app/managers/string-manager';
import { CategoriasService } from 'app/services/categorias.service';
import { FuncionesService } from 'app/services/funciones.service';
import { ImagenesProductosService } from 'app/services/imagenes-productos.service';
import { MarcasService } from 'app/services/marcas.service';
import { PreciosProductosService } from 'app/services/precios-productos.service';
import { ProductosService } from 'app/services/productos.service';
import { ProveedoresService } from 'app/services/proveedores.service';
import { UserApiService } from 'app/services/user-api.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { environment } from 'environments/environment';
import { CategoriaPopupComponent } from '../../categorias/categoria-popup/categoria-popup.component';
import { MarcaPopupComponent } from '../../marcas/marca-popup/marca-popup.component';
import { ProveedoresPopupComponent } from '../../proveedores/proveedores-popup/proveedores-popup.component';

@Component({
  selector: 'app-creacion-rapida-producto',
  templateUrl: './creacion-rapida-producto.component.html',
  styleUrls: ['./creacion-rapida-producto.component.scss']
})
export class CreacionRapidaProductoComponent implements OnInit {

  categorias: Categoria[] = [];
  proveedores: Proveedor[] = [];
  marcas: Marca[] = [];
  listaEmpleados: any[] = [];
  public itemForm: FormGroup;
  codigosProducto: CodigosProducto[] = [];
  precios: PrecioProductoDto[] = [];

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


  productoDTO: ProductoDto = {
    cantidadExistencias: null,
    categoria: null,
    costo: null,
    cantidadMinima: null,
    codigoExterno: null,
    descripcion: null,
    esLiquidacion: false,
    idProducto: null,
    marca: null,
    nombre: null,
    proveedor: null,
    codigoResponsable: null
  }

  producto: Producto = {
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
    proveedor: null,
    detalles: null,
    detallesProformas: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    imagenes: null,
    kardexes: null,
    precios: null,
    codigoResponsable: null
  }

  precioProducto: PrecioProducto = {
    esLiquidacion: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    idPrecioProducto: null,
    nombre: null,    
    precioVenta: null,
    producto: null,
    utilidad: null,
    utilidadLiquidacion: null,
    precioVentaLiquidacion: null
  }

  imagenProductoDTO: ImagenProductoDto = {
    URL: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    idImagenProducto: null,
    producto: null
  }

  imagenProducto: ImagenProducto = {
    URL: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    idImagenProducto: null,
    producto: null
  }

  constructor(
    private categoriasService: CategoriasService,
    private snack: MatSnackBar,
    private tokenService: UserApiService,
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private proveedoresService: ProveedoresService,
    private marcasService: MarcasService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreacionRapidaProductoComponent>,
    private funcionesService: FuncionesService,
    private dialog: MatDialog,
    private productosService: ProductosService,
    private preciosProductosService: PreciosProductosService,
    private imagenesService: ImagenesProductosService
  ) { }

  ngOnInit(): void {
    this.buildItemForm(this.data.payload);        
    this.cargarEmpleados();
    this.cargarCategorias();        
    this.cargarProveedores();
    this.cargarMarcas();            
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({            
      idProducto: [item.idProducto || '', Validators.required],
      codigoExterno: [item.codigoExterno || '', Validators.required],
      nombre: [item.name || '', Validators.required],
      descripcion: [item.descripcion || ''],
      autorizacionEmpleado: ['']
    });
  }

  cargarEmpleados(){
    this.funcionesService.obtenerEmpleados().subscribe(
      res => {
        this.listaEmpleados = res;
      },
      err => {
        this.reintento(err, nombresMetodos.cargarEmpleados);
      }
    );
  }

  cargarCategorias(){    
    this.categoriasService.getAll().subscribe(
      res => {
        this.categorias = res;
      },
      err => {
        this.reintento(err, nombresMetodos.cargarCategorias);
      }
    );
  }

  cargarProveedores(){
    this.proveedoresService.getAll().subscribe(
      res => {
        this.proveedores = res;
      },
      err => {
        this.reintento(err, nombresMetodos.cargarProveedores);
      }
    );
  }

  cargarMarcas(){
    this.marcasService.getAll().subscribe(
      res => {
        this.marcas = res;
      },
      err => {
        this.reintento(err, nombresMetodos.cargarMarcas);
      }
    );
  }

  validaCodigoProducto(){
    this.funcionesService.obtieneCodigosProducto(this.productoDTO.codigoExterno).subscribe(
      res => {
        this.codigosProducto = res;
        let maxContador = 0;

        if(this.codigosProducto.length != 0){
          this.codigosProducto.forEach(element => {
            if(element.idProducto.split('-').length > 1){
              if(+element.idProducto.split('-')[1] > maxContador){
                maxContador = +element.idProducto.split('-')[1];
              }
            }            
          });         
          this.snack.open(this.strings.msg_codigo_producto_existente, this.strings.alert_title, { duration: environment.TIEMPO_NOTIFICACION });
          this.productoDTO.idProducto = this.productoDTO.idProducto + '-' + (maxContador+1);  
        }
      },
      err => {
        this.reintento(err, nombresMetodos.validaCodigoProducto);
      }
    );
  }

  openPopUpProveedor(data: any = {}, isNew?) {
    let title = isNew ? this.strings.proveedor_agregar : this.strings.proveedor_editar;
    let dialogRef: MatDialogRef<any> = this.dialog.open(ProveedoresPopupComponent, {
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
        if (isNew) {
          this.proveedoresService.getAll().subscribe(
            res => {
              this.proveedores = res;              
              this.snack.open(this.strings.proveedor_creada, this.strings.success_title, { duration: environment.TIEMPO_NOTIFICACION });
            },
            err => {
              this.reintento(err, nombresMetodos.openPopUpProveedor, data, isNew);
            }
          );
        } else {          
          this.proveedoresService.getAll().subscribe(
            res => {
              this.proveedores = res;              
              this.snack.open(this.strings.proveedor_editada, this.strings.success_title, { duration: environment.TIEMPO_NOTIFICACION });                       
            },
            err => {
              this.reintento(err, nombresMetodos.openPopUpProveedor, data, isNew);            
            }
          );          
        }
      })
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
        if (isNew) {
          this.categoriasService.getAll().subscribe(
            res => {
              this.categorias = res;
              this.snack.open(this.strings.categoria_creada, this.strings.success_title, { duration: environment.TIEMPO_NOTIFICACION });
            },
            err => {
              this.reintento(err, nombresMetodos.openPopUp, data, isNew);
            }
          );
        } else {          
          this.categoriasService.getAll().subscribe(
            res => {
              this.categorias = res;
              this.snack.open(this.strings.categoria_editada, this.strings.success_title, { duration: environment.TIEMPO_NOTIFICACION });
            },
            err => {
              this.reintento(err, nombresMetodos.openPopUp, data, isNew);            
            }
          );          
        }
      })
  }

  openPopUpMarca(data: any = {}, isNew?) {
    let title = isNew ? this.strings.marca_agregar : this.strings.marca_editar;
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
        if (isNew) {
          this.marcasService.getAll().subscribe(
            res => {
              this.marcas = res;              
              this.snack.open(this.strings.marca_creada, this.strings.success_title, { duration: environment.TIEMPO_NOTIFICACION });
            },
            err => {
              this.reintento(err, nombresMetodos.openPopUpMarca, data, isNew);
            }
          );
        } else {          
          this.marcasService.getAll().subscribe(
            res => {
              this.marcas = res;              
              this.snack.open(this.strings.marca_editada, this.strings.success_title, { duration: environment.TIEMPO_NOTIFICACION });                       
            },
            err => {
              this.reintento(err, nombresMetodos.openPopUpMarca, data, isNew);             
            }
          );          
        }
      })
  }  

  submit(){
    if(this.empleadoConAutrizacion()){
      this.productoDTO.codigoResponsable = this.itemForm.controls.autorizacionEmpleado.value;    
      this.productoDTO.costo = 0;
      this.productoDTO.esLiquidacion = false;
      this.nuevoProducto();      
    }else{
      this.snack.open("El código de empleado no es correcto. Por favor validarlo y volver a intentarlo.", "ERROR", { duration: 4000 });         
    }    
  }

  nuevoProducto(){
    this.productosService.newRow(this.productoDTO).subscribe(
      res => {
        this.producto = res;
        let contador: number = 1;    
        this.crearListaPrecios();        
        this.precios.forEach(element => {
          this.preciosProductosService.newRow(element).subscribe(
            res => {
              this.precioProducto = res;
              contador = contador + 1;
              if(contador == 4){
                this.imagenProductoDTO.URL = `https://${this.serviceManager.AZUREACCOUNTNAME}.blob.core.windows.net/${this.serviceManager.AZURECONTAINERNAME}/default`;
                this.imagenProductoDTO.producto = this.producto.idProducto;
                this.imagenesService.newRow(this.imagenProductoDTO).subscribe(
                  res => {
                    this.imagenProducto = res;
                    this.snack.open("El producto fue creado con éxito", "ÉXITO", { duration: 4000 });
                    this.dialogRef.close(this.producto);
                  },
                  err => {                    
                    this.reintento(err, nombresMetodos.nuevoProducto);
                  }
                );                
              }
            },
            err => {
              this.reintento(err, nombresMetodos.nuevoProducto);
            }
          );
        });        
      },
      err => {
        this.reintento(err, nombresMetodos.nuevoProducto);
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

  crearListaPrecios(){    
    // -- Precio 1    
    let idPrecioProducto1 = -1;    
    this.precios.push({      
      idPrecioProducto: idPrecioProducto1,
      esLiquidacion: this.productoDTO.esLiquidacion,            
      nombre: "precio1",
      utilidad: 0,
      utilidadLiquidacion: 0,
      precioVentaLiquidacion: 0,
      precioVenta: 0,
      producto: this.producto.idProducto    
    });
    // -- Precio 2
    let idPrecioProducto2 = -1;    
    this.precios.push({
      idPrecioProducto: idPrecioProducto2,
      esLiquidacion: this.productoDTO.esLiquidacion,      
      nombre: "precio2",
      utilidad: 0,
      utilidadLiquidacion: 0,
      precioVentaLiquidacion: 0,
      precioVenta: 0,
      producto: this.producto.idProducto    
    });
    // -- Precio 3
    let idPrecioProducto3 = -1;    
    this.precios.push({
      idPrecioProducto: idPrecioProducto3,
      esLiquidacion: this.productoDTO.esLiquidacion,      
      nombre: "precio3",
      utilidad: 0,
      utilidadLiquidacion: 0,
      precioVentaLiquidacion: 0,
      precioVenta: 0,
      producto: this.producto.idProducto    
    });
    // -- Precio 4
    let idPrecioProducto4 = -1;    
    this.precios.push({
      idPrecioProducto: idPrecioProducto4,
      esLiquidacion: this.productoDTO.esLiquidacion,      
      nombre: "precio4",
      utilidad: 0,
      utilidadLiquidacion: 0,
      precioVentaLiquidacion: 0,
      precioVenta: 0,
      producto: this.producto.idProducto    
    });
  }

  reintento(err: any, metodo: string, data?: any, isNew?: boolean){
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
              if(metodo === nombresMetodos.nuevoProducto){
                this.nuevoProducto();
              }else if(metodo === nombresMetodos.openPopUpMarca){
                this.openPopUpMarca(data, isNew);
              }else if(metodo === nombresMetodos.openPopUpProveedor){
                this.openPopUpProveedor(data, isNew);
              }else if(metodo === nombresMetodos.validaCodigoProducto){
                this.validaCodigoProducto();
              }else if(metodo === nombresMetodos.cargarMarcas){
                this.cargarMarcas();                
              }else if (metodo === nombresMetodos.cargarProveedores){
                this.cargarProveedores();
              }else if(metodo === nombresMetodos.cargarCategorias){
                this.cargarCategorias();
              }else if(metodo === nombresMetodos.cargarEmpleados){
                this.cargarEmpleados();
              }
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

}

enum nombresMetodos {
  nuevoProducto = 'nuevoProducto',
  openPopUpMarca = 'openPopUpMarca',
  openPopUp = 'openPopUp',
  openPopUpProveedor = 'openPopUpProveedor',
  validaCodigoProducto = 'validaCodigoProducto',
  cargarMarcas = 'cargarMarcas',
  cargarProveedores = 'cargarProveedores',
  cargarCategorias = 'cargarCategorias',
  cargarEmpleados = 'cargarEmpleados'
}
