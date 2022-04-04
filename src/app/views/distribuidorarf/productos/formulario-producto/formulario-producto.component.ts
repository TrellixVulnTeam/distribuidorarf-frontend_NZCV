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
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DetalleProducto } from 'app/interfaces/detalle-producto';
import { DetalleProductoDto } from 'app/interfaces/dto/detalle-producto-dto';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { CodigosProducto } from 'app/interfaces/interfaces-funciones/codigos-producto';
import { FuncionesService } from 'app/services/funciones.service';
import { CategoriaPopupComponent } from '../../categorias/categoria-popup/categoria-popup.component';
import { ProveedoresPopupComponent } from '../../proveedores/proveedores-popup/proveedores-popup.component';
import { MarcaPopupComponent } from '../../marcas/marca-popup/marca-popup.component';
import { AzureBlobStorageService } from 'app/services/azure-blob-storage.service';
import { environment } from 'environments/environment';
import { ProductosService } from 'app/services/productos.service';
import { Producto } from 'app/interfaces/producto';
import { PrecioProducto } from 'app/interfaces/precio-producto';
import { PrecioProductoDto } from 'app/interfaces/dto/precio-producto-dto';
import { PreciosProductosService } from 'app/services/precios-productos.service';
import { ImagenesProductosService } from 'app/services/imagenes-productos.service';
import { ImagenProductoDto } from 'app/interfaces/dto/imagen-producto-dto';
import { ImagenProducto } from 'app/interfaces/imagen-producto';
import { DetallesProductosService } from 'app/services/detalles-productos.service';
import { KardexDto } from 'app/interfaces/dto/kardex-dto';
import { Kardex } from 'app/interfaces/kardex';
 
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
  progreso: number = 0;
  progresoVisible: boolean = false;

  categorias: Categoria[] = [];
  proveedores: Proveedor[] = [];
  marcas: Marca[] = [];
  detallesProducto: DetalleProducto[] = [];
  precios: PrecioProductoDto[] = [];
  
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
    proveedor: null
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
    precios: null
  }

  token: Token = {
    access_token: ``
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

  detalleProductoDTO: DetalleProductoDto = {
    cantidad: null,
    colorHexadecimal: null,
    colorNombre: null,    
    idDetalleProducto: null,
    producto: null,
    talla: null
  }

  detalleProducto: DetalleProducto = {
    cantidad: null,
    colorHexadecimal: null,
    colorNombre: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    idDetalleProducto: null,
    producto: null,
    talla: null
  }

  kardexDTO: KardexDto = {
    balance: null,
    concepto: null,
    costo: null,
    fecha: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    idKardex: null,
    producto: null,
    unidades: null
  }

  kardex: Kardex = {
    balance: null,
    concepto: null,
    costo: null,
    fecha: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    idKardex: null,
    producto: null,
    unidades: null
  }
  
  public items: any[];    
  esEditar: boolean = false;

  constructor(
    private categoriasService: CategoriasService,
    private snack: MatSnackBar,
    private userApiService: UserApiService,
    private fb: FormBuilder,
    private proveedoresService: ProveedoresService,
    private marcasService: MarcasService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormularioProductoComponent>,
    private funcionesService: FuncionesService,
    private dialog: MatDialog,
    private blobService: AzureBlobStorageService,
    private productosService: ProductosService,
    private preciosProductosService: PreciosProductosService,
    private imagenesService: ImagenesProductosService,
    private detallesProductosService: DetallesProductosService
  ) { }  

  productos: Producto[] = [];

  ngOnInit(): void {    
    console.log(this.data.payload._id);
    this.buildItemForm(this.data.payload);        
    this.items = this.detallesProducto;
    this.items.push({
      id: 'ID',
      talla: 'Talla',
      cantidad: 'Cantidad',
      nombreColor: 'Nombre Color',
      color: 'transparent'
    });
    this.userApiService.login().subscribe(
      res => {
        this.token = res;       
        this.cargarCategorias();        
        this.cargarProveedores();
        this.cargarMarcas();            
        if(this.data.payload._id !== undefined){          
          this.cargarProducto(this.data.payload._id);
          this.esEditar = true;
        }    
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 4000 });
      }
    );    
  }

  cargarProducto(idProducto){
    this.productosService.getOne(this.token.access_token, idProducto).subscribe(
      res => {
        this.producto = res;              
        this.productoDTO.idProducto = this.producto.idProducto;
        this.productoDTO.categoria = this.producto.categoria.idCategoria;
        this.productoDTO.proveedor = this.producto.proveedor.identificacion;
        this.productoDTO.marca = this.producto.marca.idMarca;
        this.productoDTO.codigoExterno = this.producto.codigoExterno;
        this.productoDTO.nombre = this.producto.nombre;
        this.productoDTO.cantidadMinima = this.producto.cantidadMinima;
        this.productoDTO.cantidadExistencias = this.producto.cantidadExistencias;
        this.productoDTO.descripcion = this.producto.descripcion;
        this.productoDTO.esLiquidacion = this.producto.esLiquidacion;
        this.productoDTO.costo = this.producto.costo;

        this.preciosForm.controls.costo1.setValue(this.producto.costo);        
        this.preciosForm.controls.utilidad1.setValue(this.producto.precios[0].utilidad);
        this.preciosForm.controls.precioVenta1.setValue(this.producto.precios[0].precioVenta);
        this.preciosForm.controls.utilidadLiquidacion1.setValue(this.producto.precios[0].utilidadLiquidacion);
        this.preciosForm.controls.precioVentaLiquidacion1.setValue(this.producto.precios[0].precioVentaLiquidacion);

        this.preciosForm.controls.costo2.setValue(this.producto.costo);        
        this.preciosForm.controls.utilidad2.setValue(this.producto.precios[1].utilidad);
        this.preciosForm.controls.precioVenta2.setValue(this.producto.precios[1].precioVenta);
        this.preciosForm.controls.utilidadLiquidacion2.setValue(this.producto.precios[1].utilidadLiquidacion);
        this.preciosForm.controls.precioVentaLiquidacion2.setValue(this.producto.precios[1].precioVentaLiquidacion);

        this.preciosForm.controls.costo3.setValue(this.producto.costo);        
        this.preciosForm.controls.utilidad3.setValue(this.producto.precios[2].utilidad);
        this.preciosForm.controls.precioVenta3.setValue(this.producto.precios[2].precioVenta);
        this.preciosForm.controls.utilidadLiquidacion3.setValue(this.producto.precios[2].utilidadLiquidacion);
        this.preciosForm.controls.precioVentaLiquidacion3.setValue(this.producto.precios[2].precioVentaLiquidacion);

        this.preciosForm.controls.costo4.setValue(this.producto.costo);        
        this.preciosForm.controls.utilidad4.setValue(this.producto.precios[3].utilidad);
        this.preciosForm.controls.precioVenta4.setValue(this.producto.precios[3].precioVenta);
        this.preciosForm.controls.utilidadLiquidacion4.setValue(this.producto.precios[3].utilidadLiquidacion);
        this.preciosForm.controls.precioVentaLiquidacion4.setValue(this.producto.precios[3].precioVentaLiquidacion);

        this.producto.detalles.forEach(element => {
          this.items.push({
            id: element.idDetalleProducto,
            talla: element.talla,
            cantidad: element.cantidad,
            nombreColor: element.colorNombre,
            color: element.colorHexadecimal
          });
        });        

        this.producto.imagenes.forEach(element => {
          this.listaImagenes.push(element);
        });
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 4000 });              
      }
    );
  }

  listaImagenes: ImagenProducto[] = [];

  buildItemForm(item) {
    console.log(item.name);
    this.datosInicialesForm = this.fb.group({            
      idProducto: [item.idProducto || '', Validators.required],
      codigoExterno: [item.codigoExterno || '', Validators.required],
      nombre: [item.name || '', Validators.required],
      descripcion: [item.descripcion || ''],
      cantidadExistencias: [item.cantidadExistencias || 0],
      cantidadMinima: [item.cantidadMinima || 0]
    });
    this.preciosForm = this.fb.group({
      esLiquidacion: [item.esLiquidacion || false],
      costo: [item.costo || 0],
      costo1: [item.costo || 0],
      costo2: [item.costo || 0],
      costo3: [item.costo || 0],
      costo4: [item.costo || 0],
      utilidad1: [item.utilidad || 0],
      utilidadLiquidacion1: [item.utilidadLiquidacion || 0],
      utilidadLiquidacion2: [item.utilidadLiquidacion || 0],
      utilidadLiquidacion3: [item.utilidadLiquidacion || 0],
      utilidadLiquidacion4: [item.utilidadLiquidacion || 0],
      utilidad2: [item.utilidad || 0],
      utilidad3: [item.utilidad || 0],
      utilidad4: [item.utilidad || 0],
      precioVenta1: [item.precioVenta || 0],
      precioVentaLiquidacion1: [item.precioVentaLiquidacion || 0],
      precioVentaLiquidacion2: [item.precioVentaLiquidacion || 0],
      precioVentaLiquidacion3: [item.precioVentaLiquidacion || 0],
      precioVentaLiquidacion4: [item.precioVentaLiquidacion || 0],
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
      id: this.productoDTO.idProducto.toUpperCase() + '-' + this.detallesForm.controls.talla.value.toUpperCase() + '-' + this.detallesForm.controls.colorNombre.value.toUpperCase(),
      talla: this.detallesForm.controls.talla.value.toUpperCase(),
      cantidad: this.detallesForm.controls.cantidad.value,
      nombreColor: this.detallesForm.controls.colorNombre.value,
      color: this.color 
    })
    this.productoDTO.cantidadExistencias = this.productoDTO.cantidadExistencias  + this.detallesForm.controls.cantidad.value;
  }

  eliminarDetalle(codigo){    
    let index = this.items.findIndex(x => x.id === codigo);
    this.items.splice(index, 1);
  }

  public uploader: FileUploader = new FileUploader({ url: 'https://evening-anchorage-315.herokuapp.com/api/' });

  public hasBaseDropZoneOver: boolean = false;
  // console = console;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  codigosProducto: CodigosProducto[] = [];

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

  actualizaCostos(){
    this.preciosForm.controls.costo1.setValue(this.productoDTO.costo);
    this.preciosForm.controls.costo2.setValue(this.productoDTO.costo);
    this.preciosForm.controls.costo3.setValue(this.productoDTO.costo);
    this.preciosForm.controls.costo4.setValue(this.productoDTO.costo);
  }

  calculaPercioVenta(utilidad){    
    if(this.preciosForm.valid){
      if(utilidad == 1){      
        this.preciosForm.controls.precioVenta1.setValue(this.preciosForm.controls.costo1.value + (this.preciosForm.controls.costo1.value * this.preciosForm.controls.utilidad1.value / 100));
      }else if(utilidad == 2){
        this.preciosForm.controls.precioVenta2.setValue(this.preciosForm.controls.costo2.value + (this.preciosForm.controls.costo2.value * this.preciosForm.controls.utilidad2.value / 100));
      }else if(utilidad == 3){
        this.preciosForm.controls.precioVenta3.setValue(this.preciosForm.controls.costo3.value + (this.preciosForm.controls.costo3.value * this.preciosForm.controls.utilidad3.value / 100));
      }else if(utilidad == 4){
        this.preciosForm.controls.precioVenta4.setValue(this.preciosForm.controls.costo4.value + (this.preciosForm.controls.costo4.value * this.preciosForm.controls.utilidad4.value / 100));
      }else if(utilidad == 11){
        this.preciosForm.controls.precioVentaLiquidacion1.setValue(this.preciosForm.controls.costo1.value + (this.preciosForm.controls.costo1.value * this.preciosForm.controls.utilidadLiquidacion1.value / 100))
      }else if(utilidad == 12){
        this.preciosForm.controls.precioVentaLiquidacion2.setValue(this.preciosForm.controls.costo2.value + (this.preciosForm.controls.costo2.value * this.preciosForm.controls.utilidadLiquidacion2.value / 100))
      }else if(utilidad == 13){
        this.preciosForm.controls.precioVentaLiquidacion3.setValue(this.preciosForm.controls.costo3.value + (this.preciosForm.controls.costo3.value * this.preciosForm.controls.utilidadLiquidacion3.value / 100))
      }else if(utilidad == 14){
        this.preciosForm.controls.precioVentaLiquidacion4.setValue(this.preciosForm.controls.costo4.value + (this.preciosForm.controls.costo4.value * this.preciosForm.controls.utilidadLiquidacion4.value / 100))
      }
    }else{
      this.snack.open("Posee valores inválidos, por favor revise", "ERROR!!", { duration: 4000 });
    }  
  }

  calculaUtilidad(precio){    
    if(this.preciosForm.valid){
      if(precio == 1){
        this.preciosForm.controls.utilidad1.setValue((this.preciosForm.controls.precioVenta1.value-this.preciosForm.controls.costo1.value) / this.preciosForm.controls.costo1.value * 100);
      }else if(precio == 2){
        this.preciosForm.controls.utilidad2.setValue((this.preciosForm.controls.precioVenta2.value-this.preciosForm.controls.costo2.value) / this.preciosForm.controls.costo2.value * 100);
      }else if(precio == 3){
        this.preciosForm.controls.utilidad3.setValue((this.preciosForm.controls.precioVenta3.value-this.preciosForm.controls.costo3.value) / this.preciosForm.controls.costo3.value * 100);
      }else if(precio == 4){
        this.preciosForm.controls.utilidad4.setValue((this.preciosForm.controls.precioVenta4.value-this.preciosForm.controls.costo4.value) / this.preciosForm.controls.costo4.value * 100);
      }else if(precio == 11){
        this.preciosForm.controls.utilidadLiquidacion1.setValue((this.preciosForm.controls.precioVentaLiquidacion1.value-this.preciosForm.controls.costo1.value) / this.preciosForm.controls.costo1.value * 100);
      }else if(precio == 12){
        this.preciosForm.controls.utilidadLiquidacion2.setValue((this.preciosForm.controls.precioVentaLiquidacion2.value-this.preciosForm.controls.costo2.value) / this.preciosForm.controls.costo2.value * 100);
      }else if(precio == 13){
        this.preciosForm.controls.utilidadLiquidacion3.setValue((this.preciosForm.controls.precioVentaLiquidacion3.value-this.preciosForm.controls.costo3.value) / this.preciosForm.controls.costo3.value * 100);
      }else if(precio == 14){
        this.preciosForm.controls.utilidadLiquidacion4.setValue((this.preciosForm.controls.precioVentaLiquidacion4.value-this.preciosForm.controls.costo4.value) / this.preciosForm.controls.costo4.value * 100);
      }      
    }else{
      this.snack.open("Posee valores inválidos, por favor revise", "ERROR!!", { duration: 4000 });
    }    
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

  // subirArchivos(){
  //   this.uploader.queue.forEach(element => {      
  //     const blob = new Blob([element._file], { type: element._file.type  });

  //     this.blobService.uploadImage(environment.AZURESASTOKEN, blob, element._file.name, () => {          
  //       console.log(`https://${environment.AZUREACCOUNTNAME}.blob.core.windows.net/${environment.AZURECONTAINERNAME}/${element._file.name}`);
  //     });                              
  //   });
  // }

  submit(){    
    this.progresoVisible = true;    
    let contador: number = 1;    
    console.log(this.token.access_token);    
    if(this.preciosForm.controls.esLiquidacion.value == null){
      this.productoDTO.esLiquidacion = false;
    }

    console.log(this.productoDTO);
    
    // Insertar producto (PASO 1)
    this.productosService.newRow(this.token.access_token, this.productoDTO).subscribe(
      res => {
        this.producto = res;
        this.progreso = 25;
        //Insertar los precios (PASO 2)
        this.crearListaPrecios();
        console.log(this.precios);
        this.precios.forEach(element => {
          this.preciosProductosService.newRow(this.token.access_token, element).subscribe(
            res => {
              this.precioProducto = res;
              contador = contador + 1;
              if(contador == 4){
                this.progreso = 50;
                //Insertar imágenes (PASO 3)
                let contadorImg = 1;
                let cantidadImagenes: number = this.uploader.queue.length;
                this.uploader.queue.forEach(element => {      
                  const blob = new Blob([element._file], { type: element._file.type  });
            
                  this.blobService.uploadImage(environment.AZURESASTOKEN, blob, element._file.name, () => {          
                    // console.log(`https://${environment.AZUREACCOUNTNAME}.blob.core.windows.net/${environment.AZURECONTAINERNAME}/${element._file.name}`);
                    this.imagenProductoDTO.URL = `https://${environment.AZUREACCOUNTNAME}.blob.core.windows.net/${environment.AZURECONTAINERNAME}/${element._file.name}`;
                    this.imagenProductoDTO.producto = this.producto.idProducto;
                    this.imagenesService.newRow(this.token.access_token, this.imagenProductoDTO).subscribe(
                      res => {
                        this.imagenProducto = res;
                        
                        if(contadorImg == cantidadImagenes){
                          this.progreso = 75;
                          // Insertar Detalles (Paso 4)
                          let contadorDetalles: number = this.items.length;
                          let contadorDetalle = 1;
                          this.items.forEach(element => {
                            this.detalleProductoDTO.idDetalleProducto = element.id;
                            this.detalleProductoDTO.cantidad = element.cantidad;
                            this.detalleProductoDTO.colorHexadecimal = element.color;
                            this.detalleProductoDTO.colorNombre = element.nombreColor;
                            this.detalleProductoDTO.producto = this.producto.idProducto;
                            this.detalleProductoDTO.talla = element.talla; 
                            
                            if(contadorDetalle > 1){
                              this.detallesProductosService.newRow(this.token.access_token, this.detalleProductoDTO).subscribe(
                                res => {
                                  this.detalleProducto = res;
                                  console.log('inserto el detalle');
                                  if(contadorDetalle == contadorDetalles){
                                    this.progreso = 100;
                                    this.snack.open("Producto insertado correctamente.", "ÉXITO!!", { duration: 4000 });                                
                                    this.dialogRef.close(this.producto);
                                  }
                                  contadorDetalle = contadorDetalle + 1;
                                },
                                err => {
                                  this.snack.open(err.message, "ERROR", { duration: 4000 });                                
                                }
                              );
                            }else{
                              contadorDetalle = contadorDetalle + 1;
                            }
                          });
                        }
                        contadorImg = contadorImg + 1;
                      },
                      err => {
                        this.snack.open(err.message, "ERROR", { duration: 4000 });              
                      }
                    );
                  });                              
                });
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

  crearListaPrecios(){
    // -- Precio 1
    this.precios.push({
      esLiquidacion: this.productoDTO.esLiquidacion,            
      nombre: this.preciosForm.controls.costo1.value,
      utilidad: this.preciosForm.controls.utilidad1.value,
      utilidadLiquidacion: this.preciosForm.controls.utilidadLiquidacion1.value,
      precioVentaLiquidacion: this.preciosForm.controls.precioVentaLiquidacion1.value,
      precioVenta: this.preciosForm.controls.precioVenta1.value,
      producto: this.producto.idProducto    
    });
    // -- Precio 2
    this.precios.push({
      esLiquidacion: this.productoDTO.esLiquidacion,      
      nombre: this.preciosForm.controls.costo2.value,
      utilidad: this.preciosForm.controls.utilidad2.value,
      utilidadLiquidacion: this.preciosForm.controls.utilidadLiquidacion2.value,
      precioVentaLiquidacion: this.preciosForm.controls.precioVentaLiquidacion2.value,
      precioVenta: this.preciosForm.controls.precioVenta2.value,
      producto: this.producto.idProducto    
    });
    // -- Precio 3
    this.precios.push({
      esLiquidacion: this.productoDTO.esLiquidacion,      
      nombre: this.preciosForm.controls.costo3.value,
      utilidad: this.preciosForm.controls.utilidad3.value,
      utilidadLiquidacion: this.preciosForm.controls.utilidadLiquidacion3.value,
      precioVentaLiquidacion: this.preciosForm.controls.precioVentaLiquidacion3.value,
      precioVenta: this.preciosForm.controls.precioVenta3.value,
      producto: this.producto.idProducto    
    });
    // -- Precio 4
    this.precios.push({
      esLiquidacion: this.productoDTO.esLiquidacion,      
      nombre: this.preciosForm.controls.costo4.value,
      utilidad: this.preciosForm.controls.utilidad4.value,
      utilidadLiquidacion: this.preciosForm.controls.utilidadLiquidacion4.value,
      precioVentaLiquidacion: this.preciosForm.controls.precioVentaLiquidacion4.value,
      precioVenta: this.preciosForm.controls.precioVenta4.value,
      producto: this.producto.idProducto    
    });
  }

  eliminarImagenAzure(url){
    alert("Entra a borrar la imagen: " + url);

    let rutaSplit = url.urlImagen.split('/');             
    let nombreImg = rutaSplit[rutaSplit.length-1];

    this.blobService.deleteImage(environment.AZURESASTOKEN, nombreImg, () =>{                  
    });
  }

}
