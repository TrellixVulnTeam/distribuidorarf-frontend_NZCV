import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Categoria } from 'app/interfaces/categoria';
import { ImagenProductoDto } from 'app/interfaces/dto/imagen-producto-dto';
import { PrecioProductoDto } from 'app/interfaces/dto/precio-producto-dto';
import { ProductoDto } from 'app/interfaces/dto/producto-dto';
import { ImagenProducto } from 'app/interfaces/imagen-producto';
import { CodigosProducto } from 'app/interfaces/interfaces-funciones/codigos-producto';
import { Marca } from 'app/interfaces/marca';
import { PrecioProducto } from 'app/interfaces/precio-producto';
import { Producto } from 'app/interfaces/producto';
import { Proveedor } from 'app/interfaces/proveedor';
import { Token } from 'app/interfaces/token';
import { CategoriasService } from 'app/services/categorias.service';
import { FuncionesService } from 'app/services/funciones.service';
import { ImagenesProductosService } from 'app/services/imagenes-productos.service';
import { MarcasService } from 'app/services/marcas.service';
import { PreciosProductosService } from 'app/services/precios-productos.service';
import { ProductosService } from 'app/services/productos.service';
import { ProveedoresService } from 'app/services/proveedores.service';
import { UserApiService } from 'app/services/user-api.service';
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
    private userApiService: UserApiService,
    private fb: FormBuilder,
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
    this.userApiService.login().subscribe(
      res => {
        this.token = res;       
        this.cargarEmpleados();
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
    this.itemForm = this.fb.group({            
      idProducto: [item.idProducto || '', Validators.required],
      codigoExterno: [item.codigoExterno || '', Validators.required],
      nombre: [item.name || '', Validators.required],
      descripcion: [item.descripcion || ''],
      autorizacionEmpleado: ['']
    });
  }

  cargarEmpleados(){
    this.funcionesService.obtenerEmpleados(this.token.access_token).subscribe(
      res => {
        this.listaEmpleados = res;
        console.log(this.listaEmpleados);
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 4000 });
      }
    );
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

  validaCodigoProducto(){
    this.funcionesService.obtieneCodigosProducto(this.token.access_token, this.productoDTO.codigoExterno).subscribe(
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
          this.snack.open("El código ya existe por lo se modificó", "ALERTA!!", { duration: 4000 });
          this.productoDTO.idProducto = this.productoDTO.idProducto + '-' + (maxContador+1);  
        }
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 4000 });
      }
    );
  }

  openPopUpProveedor(data: any = {}, isNew?) {
    let title = isNew ? 'Agragar Proveedor' : 'Modificar Proveedor';
    // console.log(console.log("Entra: " + data.distrito.idDistrito));
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
          this.proveedoresService.getAll(this.token.access_token).subscribe(
            res => {
              this.proveedores = res;              
              this.snack.open("El proveedor fue editado con éxito", "ÉXITO", { duration: 4000 });                       
            },
            err => {
              this.snack.open(err.message, "ERROR", { duration: 4000 });
            }
          );
        } else {          
          this.proveedoresService.getAll(this.token.access_token).subscribe(
            res => {
              this.proveedores = res;              
              this.snack.open("El proveedor fue editado con éxito", "ÉXITO", { duration: 4000 });                       
            },
            err => {
              this.snack.open(err.message, "ERROR", { duration: 4000 });
            }
          );          
        }
      })
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
        if (isNew) {
          this.categoriasService.getAll(this.token.access_token).subscribe(
            res => {
              this.categorias = res;
              // this.loader.close();
              this.snack.open("Categoría creada con éxito", "ÉXITO", { duration: 4000 });                       
            },
            err => {
              this.snack.open(err.message, "ERROR", { duration: 4000 });
            }
          );
        } else {          
          this.categoriasService.getAll(this.token.access_token).subscribe(
            res => {
              this.categorias = res;
              // this.loader.close();
              this.snack.open("Categoría editada con éxito", "ÉXITO", { duration: 4000 });                       
            },
            err => {
              this.snack.open(err.message, "ERROR", { duration: 4000 });
            }
          );          
        }
      })
  }

  openPopUpMarca(data: any = {}, isNew?) {
    let title = isNew ? 'Agragar Marca' : 'Modificar Marca';
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
          this.marcasService.getAll(this.token.access_token).subscribe(
            res => {
              this.marcas = res;              
              this.snack.open("Marca creada con éxito", "ÉXITO", { duration: 4000 });                       
            },
            err => {
              this.snack.open(err.message, "ERROR", { duration: 4000 });
            }
          );
        } else {          
          this.marcasService.getAll(this.token.access_token).subscribe(
            res => {
              this.marcas = res;              
              this.snack.open("Marca editada con éxito", "ÉXITO", { duration: 4000 });                       
            },
            err => {
              this.snack.open(err.message, "ERROR", { duration: 4000 });
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
    this.productosService.newRow(this.token.access_token, this.productoDTO).subscribe(
      res => {
        this.producto = res;
        let contador: number = 1;    
        this.crearListaPrecios();        
        this.precios.forEach(element => {
          this.preciosProductosService.newRow(this.token.access_token, element).subscribe(
            res => {
              this.precioProducto = res;
              contador = contador + 1;
              if(contador == 4){
                this.imagenProductoDTO.URL = `https://${environment.AZUREACCOUNTNAME}.blob.core.windows.net/${environment.AZURECONTAINERNAME}/default`;
                this.imagenProductoDTO.producto = this.producto.idProducto;
                this.imagenesService.newRow(this.token.access_token, this.imagenProductoDTO).subscribe(
                  res => {
                    this.imagenProducto = res;
                    this.snack.open("El producto fue creado con éxito", "ÉXITO", { duration: 4000 });
                    this.dialogRef.close(this.producto);
                  },
                  err => {
                    this.snack.open(err.message, "ERROR", { duration: 4000 });
                  }
                );                
              }
            },
            err => {
              this.snack.open(err.message, "ERROR", { duration: 4000 });
            }
          );
        });        
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 4000 });
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

}
