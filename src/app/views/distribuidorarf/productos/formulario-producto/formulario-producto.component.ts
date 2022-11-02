import { Component, Inject, OnInit } from '@angular/core';
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
import { FileUploader } from 'ng2-file-upload';
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
import swal from 'sweetalert2';
import { KardexService } from 'app/services/kardex.service';
import { ErrorBk } from 'app/interfaces/error-bk';
import { ServiceManager } from 'app/managers/service-manager';
import { StringManager } from 'app/managers/string-manager';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
 
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
  listaEmpleados: any[] = [];
  
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
    talla: null,
    codigoResponsable: null
  }

  detalleProducto: DetalleProducto = {
    cantidad: null,
    colorHexadecimal: null,
    colorNombre: null,    
    idDetalleProducto: null,
    producto: null,
    talla: null,
    codigoResponsable: null
  }

  kardexDTO: KardexDto = {
    balance: null,
    concepto: null,
    idDetalleProducto: null,
    precioVenta: null,        
    producto: null,
    unidades: null,
    persona: null,
    costo: null,
    esRetiro: null,
    codigoResponsable: null,
    esRetiroTemporal: null,
    fechaReIngreso: null,
    finalizadoReingreso: null,
    detalleProforma: null
  }

  kardex: Kardex = {
    balance: null,
    concepto: null,
    costo: null,    
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    idKardex: null,
    producto: null,
    unidades: null,
    idDetalleProducto: null,
    persona: null,
    precioVenta: null,
    esRetiro: null,
    codigoResponsable: null,
    esRetiroTemporal: null,
    fechaReIngreso: null,
    finalizadoReingreso: null,
    detalleProforma: null
  }
  
  public items: any[];    
  esEditar: boolean = false;

  error: ErrorBk = {
    statusCode: null,
    message: null
  };
  intentos = 0;
  serviceManager = ServiceManager;
  strings = StringManager;


  constructor(
    private loader: AppLoaderService,
    private categoriasService: CategoriasService,
    private snack: MatSnackBar,
    private tokenService: UserApiService,
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
    private detallesProductosService: DetallesProductosService,
    private kardexService: KardexService
  ) { }  

  productos: Producto[] = [];

  ngOnInit(): void {        
    this.buildItemForm(this.data.payload);        
    this.items = this.detallesProducto;
    this.items.push({
      id: 'ID',
      talla: 'Talla',
      cantidad: 'Cantidad',
      nombreColor: 'Nombre Color',
      color: 'transparent'
    });

    this.cargarEmpleados();
    this.cargarCategorias();        
    this.cargarProveedores();
    this.cargarMarcas();            
    if(this.data.payload._id !== undefined){          
      this.cargarProducto(this.data.payload._id);
      this.esEditar = true;
    }        
  }

  cargarProducto(idProducto){
    this.productosService.getOne(idProducto).subscribe(
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

        let precioDB1 = this.producto.precios.find(x => x.nombre === "precio1");
        this.preciosForm.controls.costo1.setValue(this.producto.costo);        
        this.preciosForm.controls.utilidad1.setValue(precioDB1.utilidad);
        this.preciosForm.controls.precioVenta1.setValue(precioDB1.precioVenta);
        this.preciosForm.controls.utilidadLiquidacion1.setValue(precioDB1.utilidadLiquidacion);
        this.preciosForm.controls.precioVentaLiquidacion1.setValue(precioDB1.precioVentaLiquidacion);

        let precioDB2 = this.producto.precios.find(x => x.nombre === "precio2");
        this.preciosForm.controls.costo2.setValue(this.producto.costo);        
        this.preciosForm.controls.utilidad2.setValue(precioDB2.utilidad);
        this.preciosForm.controls.precioVenta2.setValue(precioDB2.precioVenta);
        this.preciosForm.controls.utilidadLiquidacion2.setValue(precioDB2.utilidadLiquidacion);
        this.preciosForm.controls.precioVentaLiquidacion2.setValue(precioDB2.precioVentaLiquidacion);

        let precioDB3 = this.producto.precios.find(x => x.nombre === "precio3");
        this.preciosForm.controls.costo3.setValue(this.producto.costo);        
        this.preciosForm.controls.utilidad3.setValue(precioDB3.utilidad);
        this.preciosForm.controls.precioVenta3.setValue(precioDB3.precioVenta);
        this.preciosForm.controls.utilidadLiquidacion3.setValue(precioDB3.utilidadLiquidacion);
        this.preciosForm.controls.precioVentaLiquidacion3.setValue(precioDB3.precioVentaLiquidacion);

        let precioDB4 = this.producto.precios.find(x => x.nombre === "precio4");
        this.preciosForm.controls.costo4.setValue(this.producto.costo);        
        this.preciosForm.controls.utilidad4.setValue(precioDB4.utilidad);
        this.preciosForm.controls.precioVenta4.setValue(precioDB4.precioVenta);
        this.preciosForm.controls.utilidadLiquidacion4.setValue(precioDB4.utilidadLiquidacion);
        this.preciosForm.controls.precioVentaLiquidacion4.setValue(precioDB4.precioVentaLiquidacion);

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
    this.datosInicialesForm = this.fb.group({            
      idProducto: [item.idProducto || '', Validators.required],
      codigoExterno: [item.codigoExterno || '', Validators.required],
      nombre: [item.name || '', Validators.required],
      descripcion: [item.descripcion || ''],
      cantidadExistencias: [item.cantidadExistencias || 0],
      cantidadMinima: [item.cantidadMinima || 0],
      autorizacionEmpleado: ['', Validators.required]
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
    this.categoriasService.getAll().subscribe(
      res => {
        this.categorias = res;
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 4000 });
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

  agregarDetalle(){    
    let id = this.productoDTO.idProducto.toUpperCase() + '-' + this.detallesForm.controls.talla.value.toUpperCase() + '-' + this.detallesForm.controls.colorNombre.value.toUpperCase();
    if(this.validaDetalleExiste(id) > -1){
      this.snack.open("El detalle " + id + " ya existe", "ERROR!!", { duration: 4000 });
      return;
    }
    if(this.detallesForm.controls.talla.value === "" && this.detallesForm.controls.colorNombre.value === ""){
      this.snack.open("El detalle debe contener una talla y un nombre de color (Necesario para la etiqueta)", "ERROR!!", { duration: 4000 });
      return;
    }
    this.items.push({
      id: id,
      talla: this.detallesForm.controls.talla.value.toUpperCase(),
      cantidad: this.detallesForm.controls.cantidad.value,
      nombreColor: this.detallesForm.controls.colorNombre.value,
      color: this.color 
    });

    this.productoDTO.cantidadExistencias = 0;
    let contador = 0;

    this.items.forEach(element => {            
      if(contador > 0){
        this.productoDTO.cantidadExistencias = this.productoDTO.cantidadExistencias  + Number(element.cantidad);
      }
      contador++;      
    });    

    this.datosInicialesForm.controls.cantidadExistencias.setValue(this.productoDTO.cantidadExistencias);
  }

  validaDetalleExiste(id){    
    let index = this.items.findIndex(x => x.id === id);
    return index;
  }

  eliminarDetalle(codigo){    
    let index = this.items.findIndex(x => x.id === codigo);
    this.items.splice(index, 1);
    let contador = 0;

    this.detallesProductosService.getOne(codigo).subscribe(
      res => {
        let detalleEncontrado = res;
        if(detalleEncontrado != null){
          this.detallesProductosService.delete(codigo).subscribe(
            res => {              
              this.productoDTO.cantidadExistencias = 0;
              this.items.forEach(element => {      
                if(contador > 0){
                  this.productoDTO.cantidadExistencias = this.productoDTO.cantidadExistencias  + Number(element.cantidad);
                }            
                contador++;
              }); 
              this.datosInicialesForm.controls.cantidadExistencias.setValue(this.productoDTO.cantidadExistencias);              
              // -- Inserta la mercaderia nueva en kardex                                                                                                                            
              let precioKardex = this.productoDTO.esLiquidacion === true ? this.preciosForm.controls.precioVentaLiquidacion1.value : this.preciosForm.controls.precioVenta1.value;                              
              
              this.insertaKardex(detalleEncontrado.idDetalleProducto, -detalleEncontrado.cantidad, this.productoDTO.cantidadExistencias, precioKardex, this.preciosForm.controls.costo.value, this.productoDTO.idProducto, "Borrado Detalle de producto", true);  
            },
            err => {
              this.reintento(err, nombresMetodos.eliminarDetalle, null, null, null, codigo); 
            }
          );
        }else{
          this.productoDTO.cantidadExistencias = 0;
          this.items.forEach(element => {      
            if(contador > 0){
              this.productoDTO.cantidadExistencias = this.productoDTO.cantidadExistencias  + Number(element.cantidad);
            }            
            contador++;
          }); 
          this.datosInicialesForm.controls.cantidadExistencias.setValue(this.productoDTO.cantidadExistencias);   
        }        
      },
      err => {
        this.reintento(err, nombresMetodos.eliminarDetalle, null, null, null, codigo);
      }
    );            
  }

  public uploader: FileUploader = new FileUploader({ url: 'https://evening-anchorage-315.herokuapp.com/api/' });

  public hasBaseDropZoneOver: boolean = false;  

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  codigosProducto: CodigosProducto[] = [];

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

  actualizaCostos(){
    this.preciosForm.controls.costo1.setValue(this.productoDTO.costo);
    this.preciosForm.controls.costo2.setValue(this.productoDTO.costo);
    this.preciosForm.controls.costo3.setValue(this.productoDTO.costo);
    this.preciosForm.controls.costo4.setValue(this.productoDTO.costo);
  }

  calculaPercioVenta(utilidad){        
    if(this.preciosForm.valid){
      if(utilidad == 1){              
        this.preciosForm.controls.precioVenta1.setValue((Number(this.preciosForm.controls.costo1.value) + (Number(this.preciosForm.controls.costo1.value) * Number(this.preciosForm.controls.utilidad1.value) / 100)).toFixed(2));
      }else if(utilidad == 2){
        this.preciosForm.controls.precioVenta2.setValue((Number(this.preciosForm.controls.costo2.value) + (Number(this.preciosForm.controls.costo2.value) * Number(this.preciosForm.controls.utilidad2.value) / 100)).toFixed(2));
      }else if(utilidad == 3){
        this.preciosForm.controls.precioVenta3.setValue((Number(this.preciosForm.controls.costo3.value) + (Number(this.preciosForm.controls.costo3.value) * Number(this.preciosForm.controls.utilidad3.value) / 100)).toFixed(2));
      }else if(utilidad == 4){
        this.preciosForm.controls.precioVenta4.setValue((Number(this.preciosForm.controls.costo4.value) + (Number(this.preciosForm.controls.costo4.value) * Number(this.preciosForm.controls.utilidad4.value) / 100)).toFixed(2));
      }else if(utilidad == 11){
        let nuevoPrecio = (Number(this.preciosForm.controls.precioVenta1.value) - (Number(this.preciosForm.controls.precioVenta1.value) * Number(this.preciosForm.controls.utilidadLiquidacion1.value) / 100)).toFixed(2)
        this.preciosForm.controls.precioVentaLiquidacion1.setValue(nuevoPrecio);
      }else if(utilidad == 12){
        let nuevoPrecio = (Number(this.preciosForm.controls.precioVenta2.value) - (Number(this.preciosForm.controls.precioVenta2.value) * Number(this.preciosForm.controls.utilidadLiquidacion2.value) / 100)).toFixed(2)
        this.preciosForm.controls.precioVentaLiquidacion2.setValue(nuevoPrecio);
      }else if(utilidad == 13){
        let nuevoPrecio = (Number(this.preciosForm.controls.precioVenta3.value) - (Number(this.preciosForm.controls.precioVenta3.value) * Number(this.preciosForm.controls.utilidadLiquidacion3.value) / 100)).toFixed(2)
        this.preciosForm.controls.precioVentaLiquidacion3.setValue(nuevoPrecio);
      }else if(utilidad == 14){
        let nuevoPrecio = (Number(this.preciosForm.controls.precioVenta4.value) - (Number(this.preciosForm.controls.precioVenta4.value) * Number(this.preciosForm.controls.utilidadLiquidacion4.value) / 100)).toFixed(2)
        this.preciosForm.controls.precioVentaLiquidacion4.setValue(nuevoPrecio);
      }
    }else{
      this.snack.open("Posee valores inválidos, por favor revise", "ERROR!!", { duration: 4000 });
    }  
  }

  calculaUtilidad(precio){    
    if(this.preciosForm.valid){
      if(precio == 1){
        this.preciosForm.controls.utilidad1.setValue(((Number(this.preciosForm.controls.precioVenta1.value)-Number(this.preciosForm.controls.costo1.value)) / Number(this.preciosForm.controls.costo1.value) * 100).toFixed(2));
      }else if(precio == 2){
        this.preciosForm.controls.utilidad2.setValue(((Number(this.preciosForm.controls.precioVenta2.value)-Number(this.preciosForm.controls.costo2.value)) / Number(this.preciosForm.controls.costo2.value) * 100).toFixed(2));
      }else if(precio == 3){
        this.preciosForm.controls.utilidad3.setValue(((Number(this.preciosForm.controls.precioVenta3.value)-Number(this.preciosForm.controls.costo3.value)) / Number(this.preciosForm.controls.costo3.value) * 100).toFixed(2));
      }else if(precio == 4){
        this.preciosForm.controls.utilidad4.setValue(((Number(this.preciosForm.controls.precioVenta4.value)-Number(this.preciosForm.controls.costo4.value)) / Number(this.preciosForm.controls.costo4.value) * 100).toFixed(2));
      }else if(precio == 11){
        let nuevaUtilidad = ((Number(this.preciosForm.controls.precioVenta1.value)-Number(this.preciosForm.controls.precioVentaLiquidacion1.value))/ Number(this.preciosForm.controls.precioVenta1.value) * 100).toFixed(2);
        this.preciosForm.controls.utilidadLiquidacion1.setValue(nuevaUtilidad);
      }else if(precio == 12){
        let nuevaUtilidad = ((Number(this.preciosForm.controls.precioVenta2.value)-Number(this.preciosForm.controls.precioVentaLiquidacion2.value))/ Number(this.preciosForm.controls.precioVenta2.value) * 100).toFixed(2);
        this.preciosForm.controls.utilidadLiquidacion2.setValue(nuevaUtilidad);
      }else if(precio == 13){
        let nuevaUtilidad = ((Number(this.preciosForm.controls.precioVenta3.value)-Number(this.preciosForm.controls.precioVentaLiquidacion3.value))/ Number(this.preciosForm.controls.precioVenta3.value) * 100).toFixed(2);
        this.preciosForm.controls.utilidadLiquidacion3.setValue(nuevaUtilidad);
      }else if(precio == 14){
        let nuevaUtilidad = ((Number(this.preciosForm.controls.precioVenta4.value)-Number(this.preciosForm.controls.precioVentaLiquidacion4.value))/ Number(this.preciosForm.controls.precioVenta4.value) * 100).toFixed(2);
        this.preciosForm.controls.utilidadLiquidacion4.setValue(nuevaUtilidad);
      }      
    }else{
      this.snack.open(this.strings.error_msg_valores_invalidos, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });
    }    
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? this.strings.categoria_agregar: this.strings.categoria_editar;
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
              // this.loader.close();
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
              // this.loader.close();
              this.snack.open(this.strings.categoria_editada, this.strings.success_title, { duration: environment.TIEMPO_NOTIFICACION });
            },
            err => {
              this.reintento(err, nombresMetodos.openPopUp, data, isNew);
            }
          );          
        }
      })
  }

  openPopUpProveedor(data: any = {}, isNew?) {
    let title = isNew ? this.strings.proveedor_agregar : this.strings.proveedor_editar;
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
          this.proveedoresService.getAll().subscribe(
            res => {
              this.proveedores = res;              
              this.snack.open(this.strings.proveedor_editada, this.strings.success_title, { duration: environment.TIEMPO_NOTIFICACION });
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

  // subirArchivos(){
  //   this.uploader.queue.forEach(element => {      
  //     const blob = new Blob([element._file], { type: element._file.type  });

  //     this.blobService.uploadImage(environment.AZURESASTOKEN, blob, element._file.name, () => {          
  //       console.log(`https://${environment.AZUREACCOUNTNAME}.blob.core.windows.net/${environment.AZURECONTAINERNAME}/${element._file.name}`);
  //     });                              
  //   });

  // }

  submit(){    
    if(this.empleadoConAutrizacion()){
      this.progresoVisible = true;    
      this.productoDTO.codigoResponsable = this.datosInicialesForm.controls.autorizacionEmpleado.value;    
      if(this.esEditar){
        this.editarProducto();
      }else{
        this.nuevoProducto();
      }
    }else{
      this.snack.open(this.strings.error_codigo_empleado, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });
    }    
    
  }     

  editarProducto(){
    let contador: number = 1;
    if(this.preciosForm.controls.esLiquidacion.value == null){
      this.productoDTO.esLiquidacion = false;
    }
    // Insertar producto (PASO 1)  
    this.productosService.update(this.productoDTO.idProducto, this.productoDTO).subscribe(
      res => {        
        // this.producto = res;
        this.progreso = 25;
        let contadorPrecios = 1;
        //Insertar los precios (PASO 2)
        this.crearListaPrecios();
        this.precios.forEach(element => {          
          this.preciosProductosService.update(element.idPrecioProducto, element).subscribe(
            res => {
              this.precioProducto = res;
              contador = contador + 1;
              contadorPrecios = contadorPrecios + 1;
              if(contador == 4){                
                this.progreso = 50;
                //Insertar imágenes (PASO 3)
                let contadorImg = 1;
                let cantidadImagenes: number = this.uploader.queue.length;                
                if(cantidadImagenes > 0){
                  this.uploader.queue.forEach(element => {      
                    const blob = new Blob([element._file], { type: element._file.type  });
                    let nuevoNombre = element._file.name.split('.')[0] + '-' + contadorImg + '.' + element._file.name.split('.')[1];
              
                    this.blobService.uploadImage(this.serviceManager.AZURESASTOKEN, blob, nuevoNombre, () => {          
                      // console.log(`https://${environment.AZUREACCOUNTNAME}.blob.core.windows.net/${environment.AZURECONTAINERNAME}/${element._file.name}`);
                      this.imagenProductoDTO.URL = `https://${this.serviceManager.AZUREACCOUNTNAME}.blob.core.windows.net/${this.serviceManager.AZURECONTAINERNAME}/${nuevoNombre}`;
                      this.imagenProductoDTO.producto = this.producto.idProducto;
                      this.imagenesService.newRow(this.imagenProductoDTO).subscribe(
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
                                this.detalleProductoDTO.codigoResponsable = this.datosInicialesForm.controls.autorizacionEmpleado.value;                                

                                let detalle = this.producto.detalles.findIndex(x => x.idDetalleProducto === element.id);
                                if(contadorDetalle > 1){
                                  if(detalle > -1){ // -- debe actualizar el registro
                                    this.detallesProductosService.update(element.id, this.detalleProductoDTO).subscribe(
                                      res =>{
                                        this.detalleProducto = res;                                                                  
                                        if(contadorDetalle == contadorDetalles){
                                          this.progreso = 100;
                                          this.snack.open(this.strings.producto_editado, this.strings.success_title, { duration: environment.TIEMPO_NOTIFICACION });
                                          this.dialogRef.close(this.producto);
                                        }
                                        contadorDetalle = contadorDetalle + 1;
                                      }
                                      ,err => {
                                        this.reintento(err, nombresMetodos.editarProducto);
                                      }
                                    );
                                  }else{ // -- como no existe lo entra a insertart
                                    this.detallesProductosService.newRow(this.detalleProductoDTO).subscribe(
                                      res => {
                                        this.detalleProducto = res;                            
                                        // -- Inserta la mercaderia nueva en kardex                                                                                
                                        // let precioKardex = this.productoDTO.esLiquidacion ? this.preciosForm.controls.precioVentaLiquidacion1.value : this.preciosForm.controls.precioVenta.value;
                                        // this.insertaKardex(this.detalleProducto.idDetalleProducto, this.detalleProducto.cantidad, this.productoDTO.cantidadExistencias, precioKardex, this.producto.costo, this.productoDTO.idProducto, "Inclusión Detalle de producto", false); 

                                        if(contadorDetalle == contadorDetalles){
                                          this.progreso = 100;
                                          this.snack.open(this.strings.producto_agregado, this.strings.success_title, { duration: environment.TIEMPO_NOTIFICACION });
                                          this.dialogRef.close(this.producto);
                                        }
                                        contadorDetalle = contadorDetalle + 1;
                                      }
                                      ,err => {
                                        this.reintento(err, nombresMetodos.editarProducto);
                                      }
                                    );
                                  }
                                }
                                else{
                                  contadorDetalle = contadorDetalle + 1;
                                }                            
                              });                                
                          }
                          contadorImg = contadorImg + 1;
                        },
                        err => {
                          this.reintento(err, nombresMetodos.editarProducto);
                        }
                      );
                    });                              
                  });
                }else{
                  this.progreso = 75;
                  // Insertar Detalles (Paso 4)
                  let contadorDetalles: number = this.items.length;
                  let contadorDetalle = 1;
                  if(contadorDetalles == 0){
                      this.progreso = 100;
                      this.snack.open(this.strings.producto_agregado, this.strings.success_title, { duration: environment.TIEMPO_NOTIFICACION });
                      this.dialogRef.close(this.producto);
                  }else{
                    this.items.forEach(element => {
                      this.detalleProductoDTO.idDetalleProducto = element.id;
                      this.detalleProductoDTO.cantidad = element.cantidad;
                      this.detalleProductoDTO.colorHexadecimal = element.color;
                      this.detalleProductoDTO.colorNombre = element.nombreColor;
                      this.detalleProductoDTO.producto = this.producto.idProducto;
                      this.detalleProductoDTO.talla = element.talla;
                      this.detalleProductoDTO.codigoResponsable = this.datosInicialesForm.controls.autorizacionEmpleado.value;                       

                      if(contadorDetalle > 1){                        
                        let detalle = this.producto.detalles.findIndex(x => x.idDetalleProducto === element.id);                      
                        if(detalle > -1){ // -- debe actualizar el registro
                          this.detallesProductosService.update(element.id, this.detalleProductoDTO).subscribe(
                            res =>{
                              this.detalleProducto = res;                            

                              // // -- Inserta en kardex
                              // let precioKardex = this.productoDTO.esLiquidacion ? this.preciosForm.controls.precioVentaLiquidacion1.value : this.preciosForm.controls.precioVenta.value;
                              // this.insertaKardex(this.detalleProducto.idDetalleProducto, this.detalleProducto.cantidad, this.producto.cantidadExistencias, precioKardex, this.producto.costo, this.productoDTO.idProducto); 


                              if(contadorDetalle == contadorDetalles){
                                this.progreso = 100;
                                this.snack.open(this.strings.producto_agregado, this.strings.success_title, { duration: environment.TIEMPO_NOTIFICACION });
                                this.dialogRef.close(this.producto);
                              }
                              contadorDetalle = contadorDetalle + 1;
                            }
                            ,err => {
                              this.reintento(err, nombresMetodos.editarProducto);
                            }
                          );
                        }else{ // -- como no existe lo entra a insertart
                          this.detallesProductosService.newRow(this.detalleProductoDTO).subscribe(
                            res => {
                              this.detalleProducto = res;             
                              // -- Inserta la mercaderia nueva en kardex                                                                                                              
                              let precioKardex = this.productoDTO.esLiquidacion === true ? this.preciosForm.controls.precioVentaLiquidacion1.value : this.preciosForm.controls.precioVenta1.value;                              
                              this.insertaKardex(this.detalleProducto.idDetalleProducto, this.detalleProducto.cantidad, this.productoDTO.cantidadExistencias, precioKardex, this.producto.costo, this.productoDTO.idProducto, "Inclusión Detalle de producto", false);                
                              if(contadorDetalle == contadorDetalles){
                                this.progreso = 100;
                                this.snack.open(this.strings.producto_agregado, this.strings.success_title, { duration: environment.TIEMPO_NOTIFICACION });
                                this.dialogRef.close(this.producto);
                              }
                              contadorDetalle = contadorDetalle + 1;
                            }
                            ,err => {
                              this.reintento(err, nombresMetodos.editarProducto);
                            }
                          );
                        }
                      }else{
                        contadorDetalle = contadorDetalle + 1;
                      }
                    });                  
                  }                  
                }
              }
            }
            ,err => {
              this.reintento(err, nombresMetodos.editarProducto);
            }
          );
        });
      },
      err => {
        this.reintento(err, nombresMetodos.editarProducto);
      }
    );
  }

  nuevoProducto(){
    if(this.preciosForm.controls.esLiquidacion.value == null){
      this.productoDTO.esLiquidacion = false;
    }
    let contador: number = 1;    
    if(this.uploader.queue.length == 0){
      this.snack.open(this.strings.producto_msg_insertar_una_imagen, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });
      this.progresoVisible = false;        
      return;
    }
    // Insertar producto (PASO 1)
    this.productosService.newRow(this.productoDTO).subscribe(
      res => {
        this.producto = res;
        this.progreso = 25;
    
        //Insertar los precios (PASO 2)
        this.crearListaPrecios();        
        this.precios.forEach(element => {
          this.preciosProductosService.newRow(element).subscribe(
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
            
                  this.blobService.uploadImage(this.serviceManager.AZURESASTOKEN, blob, element._file.name, () => {          
                    // console.log(`https://${environment.AZUREACCOUNTNAME}.blob.core.windows.net/${environment.AZURECONTAINERNAME}/${element._file.name}`);
                    this.imagenProductoDTO.URL = `https://${this.serviceManager.AZUREACCOUNTNAME}.blob.core.windows.net/${this.serviceManager.AZURECONTAINERNAME}/${element._file.name}`;
                    this.imagenProductoDTO.producto = this.producto.idProducto;
                    this.imagenesService.newRow(this.imagenProductoDTO).subscribe(
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
                                this.detallesProductosService.newRow(this.detalleProductoDTO).subscribe(
                                  res => {
                                    this.detalleProducto = res;
                                    let precioKardex = this.productoDTO.esLiquidacion === true ? this.preciosForm.controls.precioVentaLiquidacion1.value : this.preciosForm.controls.precioVenta1.value;                              
                                    this.insertaKardex(this.detalleProducto.idDetalleProducto, this.detalleProducto.cantidad, this.productoDTO.cantidadExistencias, precioKardex, this.producto.costo, this.productoDTO.idProducto, "Inclusión Detalle de producto", false);   
                                    if(contadorDetalle == contadorDetalles){
                                      this.progreso = 100;
                                      this.snack.open(this.strings.producto_agregado, this.strings.success_title, { duration: environment.TIEMPO_NOTIFICACION });
                                      this.dialogRef.close(this.producto);
                                    }
                                    contadorDetalle = contadorDetalle + 1;
                                  },
                                  err => {
                                    this.reintento(err, nombresMetodos.nuevoProducto);
                                  }
                                );
                              }else{
                                contadorDetalle = contadorDetalle + 1;
                                this.progreso = 100;
                                this.snack.open(this.strings.producto_agregado, this.strings.success_title, { duration: environment.TIEMPO_NOTIFICACION });                         
                                this.dialogRef.close(this.producto);                                
                              }
                            });                          
                        }
                        contadorImg = contadorImg + 1;
                      },
                      err => {
                        this.reintento(err, nombresMetodos.nuevoProducto);
                      }
                    );
                  });                              
                });
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

  // -- Inserta la mercaderia nueva en kardex  
  insertaKardex(idDetalleProducto, cantidad, balance, precioKardex, costo, producto, concepto, esRetiro){
    this.kardexDTO.idDetalleProducto = idDetalleProducto;
    this.kardexDTO.unidades = cantidad;
    this.kardexDTO.balance = balance;
    this.kardexDTO.precioVenta = precioKardex;
    this.kardexDTO.costo = costo;
    this.kardexDTO.concepto = concepto;
    this.kardexDTO.producto  = producto;
    this.kardexDTO.persona = null;
    this.kardexDTO.esRetiro = esRetiro;
    this.kardexDTO.codigoResponsable = this.datosInicialesForm.controls.autorizacionEmpleado.value;    
    this.accionInsertarKardex();
  }

  accionInsertarKardex(){
    this.kardexService.newRow(this.kardexDTO).subscribe(
      res => {
        console.log("Kardex insertado");
      },
      err => {
        this.reintento(err, nombresMetodos.accionInsertarKardex);
      }
    );
  }

  crearListaPrecios(){    
    // -- Precio 1    
    let idPrecioProducto1 = -1;
    if(this.esEditar){
      const precio1 = this.producto.precios.find(x => x.nombre === "precio1");
      idPrecioProducto1 = precio1.idPrecioProducto;
    }
    if(this.productoDTO.esLiquidacion == false){
      this.preciosForm.controls.utilidadLiquidacion1.setValue(0);
      this.preciosForm.controls.precioVentaLiquidacion1.setValue(0);
    }
    this.precios.push({      
      idPrecioProducto: idPrecioProducto1,
      esLiquidacion: this.productoDTO.esLiquidacion,            
      nombre: "precio1",
      utilidad: this.preciosForm.controls.utilidad1.value,
      utilidadLiquidacion: this.preciosForm.controls.utilidadLiquidacion1.value,
      precioVentaLiquidacion: this.preciosForm.controls.precioVentaLiquidacion1.value,
      precioVenta: this.preciosForm.controls.precioVenta1.value,
      producto: this.producto.idProducto    
    });
    // -- Precio 2
    let idPrecioProducto2 = -1;
    if(this.esEditar){
      const precio2 = this.producto.precios.find(x => x.nombre === "precio2");
      idPrecioProducto2 = precio2.idPrecioProducto;
    }
    if(this.productoDTO.esLiquidacion == false){
      this.preciosForm.controls.utilidadLiquidacion2.setValue(0);
      this.preciosForm.controls.precioVentaLiquidacion2.setValue(0);
    }
    this.precios.push({
      idPrecioProducto: idPrecioProducto2,
      esLiquidacion: this.productoDTO.esLiquidacion,      
      nombre: "precio2",
      utilidad: this.preciosForm.controls.utilidad2.value,
      utilidadLiquidacion: this.preciosForm.controls.utilidadLiquidacion2.value,
      precioVentaLiquidacion: this.preciosForm.controls.precioVentaLiquidacion2.value,
      precioVenta: this.preciosForm.controls.precioVenta2.value,
      producto: this.producto.idProducto    
    });
    // -- Precio 3
    let idPrecioProducto3 = -1;
    if(this.esEditar){
      const precio3 = this.producto.precios.find(x => x.nombre === "precio3");
      idPrecioProducto3 = precio3.idPrecioProducto;
    }
    if(this.productoDTO.esLiquidacion == false){
      this.preciosForm.controls.utilidadLiquidacion3.setValue(0);
      this.preciosForm.controls.precioVentaLiquidacion3.setValue(0);
    }
    this.precios.push({
      idPrecioProducto: idPrecioProducto3,
      esLiquidacion: this.productoDTO.esLiquidacion,      
      nombre: "precio3",
      utilidad: this.preciosForm.controls.utilidad3.value,
      utilidadLiquidacion: this.preciosForm.controls.utilidadLiquidacion3.value,
      precioVentaLiquidacion: this.preciosForm.controls.precioVentaLiquidacion3.value,
      precioVenta: this.preciosForm.controls.precioVenta3.value,
      producto: this.producto.idProducto    
    });
    // -- Precio 4
    let idPrecioProducto4 = -1;
    if(this.esEditar){
      const precio4 = this.producto.precios.find(x => x.nombre === "precio4");
      idPrecioProducto4 = precio4.idPrecioProducto;
    }
    if(this.productoDTO.esLiquidacion == false){
      this.preciosForm.controls.utilidadLiquidacion4.setValue(0);
      this.preciosForm.controls.precioVentaLiquidacion4.setValue(0);
    }
    this.precios.push({
      idPrecioProducto: idPrecioProducto4,
      esLiquidacion: this.productoDTO.esLiquidacion,      
      nombre: "precio4",
      utilidad: this.preciosForm.controls.utilidad4.value,
      utilidadLiquidacion: this.preciosForm.controls.utilidadLiquidacion4.value,
      precioVentaLiquidacion: this.preciosForm.controls.precioVentaLiquidacion4.value,
      precioVenta: this.preciosForm.controls.precioVenta4.value,
      producto: this.producto.idProducto    
    });
  }

  eliminarImagenAzure(url, idImagenProducto){    
    swal.fire({
      title: this.strings.producto_titulo_borrar_imagen,
      text: this.strings.producto_msg_borrar_imagen,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.strings.producto_btn_borrar_imagen,
      cancelButtonText: this.strings.btn_cancelar
    }).then((result) =>{
      if(result.value){                                
        let rutaSplit = url.split('/');                     
        let nombreImg = rutaSplit[rutaSplit.length-1];

        this.imagenesService.delete(idImagenProducto).subscribe(
          res => {
            this.snack.open(this.strings.producto_img_eliminada, this.strings.success_title, { duration: environment.TIEMPO_NOTIFICACION });
            let index = this.listaImagenes.findIndex(x => x.idImagenProducto === idImagenProducto);
            this.listaImagenes.splice(index, 1);            
          },
          err => {
            this.reintento(err, nombresMetodos.eliminarImagenAzure, null, null, url, idImagenProducto);
          }
        );

        this.blobService.deleteImage(this.serviceManager.AZURESASTOKEN, nombreImg, () =>{          
        });
      }
    });    
  }

  empleadoConAutrizacion(){
    let autorizado = false;    
    this.listaEmpleados.forEach(element => {      
      if(element.codigoAutorizacion === this.datosInicialesForm.controls.autorizacionEmpleado.value){
        autorizado = true;
        return autorizado;
      }      
    });

    return autorizado;
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

  reintento(err: any, metodo: string, data?: any, isNew?: boolean, url?: string, id?: number){
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
              if(metodo === nombresMetodos.cargarEmpleados){
                this.cargarEmpleados();
              }else if(metodo === nombresMetodos.eliminarImagenAzure){
                this.eliminarImagenAzure(url, id);
              }else if(metodo === nombresMetodos.accionInsertarKardex){
                this.accionInsertarKardex();
              }else if(metodo === nombresMetodos.nuevoProducto){
                this.nuevoProducto();
              }else if(metodo === nombresMetodos.editarProducto){
                this.editarProducto();
              }else if(metodo === nombresMetodos.openPopUpMarca){
                this.openPopUpMarca(data, isNew);
              }else if(metodo === nombresMetodos.openPopUpProveedor){
                this.openPopUpProveedor(data, isNew);
              }else if(metodo === nombresMetodos.openPopUp){
                this.openPopUp(data, isNew);
              }else if(metodo === nombresMetodos.eliminarDetalle){
                this.eliminarDetalle(id);
              }else if(metodo === nombresMetodos.cargarMarcas){
                this.cargarMarcas();
              }else if(metodo === nombresMetodos.cargarProveedores){
                this.cargarProveedores();
              }else{
                this.snack.open(this.strings.error_mgs_metodo_no_encontrado + metodo, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });
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
  cargarEmpleados = 'cargarEmpleados',
  eliminarImagenAzure = 'eliminarImagenAzure',
  accionInsertarKardex = 'accionInsertarKardex',
  nuevoProducto = 'nuevoProducto',
  editarProducto = 'editarProducto',
  openPopUpMarca = 'openPopUpMarca',
  openPopUpProveedor = 'openPopUpProveedor',
  openPopUp = 'openPopUp',
  validaCodigoProducto = 'validaCodigoProducto',
  eliminarDetalle = 'eliminarDetalle',
  cargarMarcas = 'cargarMarcas',
  cargarProveedores = 'cargarProveedores'
}