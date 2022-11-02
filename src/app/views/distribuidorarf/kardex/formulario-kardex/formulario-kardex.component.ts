import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DetalleProducto } from 'app/interfaces/detalle-producto';
import { DetalleProductoDto } from 'app/interfaces/dto/detalle-producto-dto';
import { KardexDto } from 'app/interfaces/dto/kardex-dto';
import { ProductoDto } from 'app/interfaces/dto/producto-dto';
import { Persona } from 'app/interfaces/persona';
import { Token } from 'app/interfaces/token';
import { DetallesProductosService } from 'app/services/detalles-productos.service';
import { FuncionesService } from 'app/services/funciones.service';
import { KardexService } from 'app/services/kardex.service';
import { ProductosService } from 'app/services/productos.service';
import { UserApiService } from 'app/services/user-api.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Kardex } from 'app/interfaces/kardex';
import Swal from 'sweetalert2';
import { ErrorBk } from 'app/interfaces/error-bk';
import { ServiceManager } from 'app/managers/service-manager';
import { StringManager } from 'app/managers/string-manager';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { environment } from 'environments/environment';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-formulario-kardex',
  templateUrl: './formulario-kardex.component.html',
  styleUrls: ['./formulario-kardex.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class FormularioKardexComponent implements OnInit {

  public itemForm: FormGroup;
  token: Token = {
    access_token: null
  }

  mensaje: string;

  esRetiroTemporal: boolean = false;
  @ViewChild("fechaReingresoElement") fechaReingresoElement: ElementRef;
  @ViewChild("iconoTemporalElement") iconoTemporalElement: ElementRef;

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

  kardexDTO: KardexDto = {
    balance: null,
    concepto: null,
    idDetalleProducto: null,
    persona: null,
    precioVenta: null,
    producto: null,
    unidades: null,
    costo: null,
    esRetiro: null,
    codigoResponsable: null,
    esRetiroTemporal: null,
    fechaReIngreso: null,
    finalizadoReingreso: null,
    detalleProforma: null
  }

  kardexRetiroTemporalDTO: KardexDto = {
    balance: null,
    concepto: null,
    idDetalleProducto: null,
    persona: null,
    precioVenta: null,
    producto: null,
    unidades: null,
    costo: null,
    esRetiro: null,
    codigoResponsable: null,
    esRetiroTemporal: null,
    fechaReIngreso: null,
    finalizadoReingreso: null,
    detalleProforma: null
  }

  kardexEncontrado: Kardex = {
    balance: null,
    concepto: null,
    idDetalleProducto: null,
    persona: null,
    precioVenta: null,
    producto: null,
    unidades: null,
    costo: null,
    esRetiro: null,
    codigoResponsable: null,
    esRetiroTemporal: null,
    fechaReIngreso: null,
    finalizadoReingreso: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    idKardex: null,
    detalleProforma: null
  }

  detalleDTO: DetalleProductoDto = {
    cantidad: null,
    colorHexadecimal: null,
    colorNombre: null,
    idDetalleProducto: null,
    producto: null,
    talla: null,
    codigoResponsable: null
  }

  idDetalle: string = "-1";
  listaEmpleados: Persona[] = [];
  maxCant: number = 1000000;

  error: ErrorBk = {
    statusCode: null,
    message: null
  };
  intentos = 0;
  serviceManager = ServiceManager;
  strings = StringManager;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormularioKardexComponent>,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private productosService: ProductosService,
    private tokenService: UserApiService,
    private kardexService: KardexService,
    private detallesProductosSerice: DetallesProductosService,
    private funcionesService: FuncionesService,
    private loader: AppLoaderService,
  ) { }

  ngOnInit(): void {        
    this.buildItemForm(this.data.payload);        
    this.cargarEmpleados();
    if(this.data.recibir == true){
      let tagIcono = this.iconoTemporalElement.nativeElement;
      tagIcono.classList.add('invisible');
      this.itemForm.controls.concepto.setValue('Inclusión de mercadería');
      if(this.data.idDevolucion > 0){
        this.mensaje = 'La cantidad de productos no re-integrados en este proceso quedarán desechados automáticamente.';            
        // Si el recibir es producto de un reintegro de producto que se habia sacado de inventario por algun motivo busca el kardex correspondiente
        this.obtenerKardex();
      }          
    }else{      
      this.itemForm.controls.concepto.setValue('Retiro de mercadería');
    }            
  }

  obtenerKardex(){    
    this.kardexService.getOne(this.data.payload.idProducto, this.data.idDevolucion).subscribe(
      res => {
        this.kardexEncontrado = res;
        this.maxCant = Math.abs(this.kardexEncontrado.unidades);
        this.idDetalle = this.kardexEncontrado.idDetalleProducto;
        this.itemForm.controls.concepto.setValue('Recibido de retiro temporal: ' + this.kardexEncontrado.idKardex);
        this.cambiaDetalle();
      },
      err => {
        this.reintento(err, nombresMetodos.obtenerKardex);
      }
    );
  }

  submit(){
    if(this.esRetiroTemporal == true && this.itemForm.controls.fecha.value == null){
      this.snack.open("El retiro temporal requiere que indique una fecha de re-integro.", "ERROR", { duration: 4000 });         
      return;
    }
    if(this.empleadoConAutrizacion()){
      this.finalizaFormulario();
    }else{
      this.snack.open("El código de empleado no es correcto. Por favor validarlo y volver a intentarlo.", "ERROR", { duration: 4000 });         
    }    
  }  

  finalizaFormulario(){
    this.crearObjetoKardex(this.data.payload);
    this.crearObjectoDetalleDTO(this.data.payload);    
    
    if(this.data.recibir == true){                  
      // si es devolución primero debe alertar de que el retiro temporal quedará finalizado.
      if(this.data.idDevolucion > 0){
        this.finalizaKardexRetiroTemporal();
      } 
      this.recibir();
    }else{
      if(this.validaCantidadExistencias(this.data.payload) === true){
        this.retirar();
      }else{
        const detalleActualizar = this.data.payload.detalles.find(x => x.idDetalleProducto === this.idDetalle);
        this.snack.open("No puede retirar más existencias de las que existen en inventario (Cantidad en inventario: " + detalleActualizar.cantidad + ")", "ERROR", { duration: 4000 });
      }
    }
  }

  validaCantidadExistencias(item){
    const detalleActualizar = item.detalles.find(x => x.idDetalleProducto === this.idDetalle);    
    if(this.itemForm.controls.cantidad.value > detalleActualizar.cantidad){      
      return false;
    }    
    return true;
  }

  finalizaKardexRetiroTemporal(){
    this.crearObjetoKardexRetiroTemporalDTO();
    this.kardexService.update(this.kardexEncontrado.idKardex, this.kardexRetiroTemporalDTO).subscribe(
      res => {
        this.snack.open("Re-inserción finalizada con éxito.", "Actualización!!", { duration: 4000 }); 
      },
      err => {
        this.reintento(err, nombresMetodos.finalizaKardexRetiroTemporal);
      }
    );
  }

  retirar(){
    // -- inserta en kardex        
    this.kardexService.newRow(this.kardexDTO).subscribe(
      res => {
        // -- actualiza el detalle        
        this.detallesProductosSerice.update(this.detalleDTO.idDetalleProducto, this.detalleDTO).subscribe(
          res => {
            // -- actualiza el producto
            this.productoDTO.cantidadExistencias = this.productoDTO.cantidadExistencias - Math.abs(this.kardexDTO.unidades);
            this.productosService.update(this.productoDTO.idProducto, this.productoDTO).subscribe(
              res => {
                this.dialogRef.close(res);
              },
              err => {
                this.reintento(err, nombresMetodos.retirar);
              }
            );
          },
          err => {
            this.reintento(err, nombresMetodos.retirar);
          }
        );
      },
      err => {
        this.reintento(err, nombresMetodos.retirar);
      }
    );
  }

  recibir(){    
    // -- inserta en kardex        
    this.kardexService.newRow(this.kardexDTO).subscribe(
      res => {
        // -- actualiza el detalle        
        this.detallesProductosSerice.update(this.detalleDTO.idDetalleProducto, this.detalleDTO).subscribe(
          res => {
            // -- actualiza el producto
            this.productoDTO.cantidadExistencias = this.productoDTO.cantidadExistencias + Math.abs(this.kardexDTO.unidades);
            this.productosService.update(this.productoDTO.idProducto, this.productoDTO).subscribe(
              res => {
                this.snack.open("Producto recibido.", "Éxito!!", { duration: 4000 }); 
                this.dialogRef.close(res);
              },
              err => {
                this.reintento(err, nombresMetodos.recibir);
              }
            );
          },
          err => {
            this.reintento(err, nombresMetodos.recibir);
          }
        );
      },
      err => {
        this.reintento(err, nombresMetodos.recibir);
      }
    );
  }

  crearObjetoKardexRetiroTemporalDTO(){
    this.kardexRetiroTemporalDTO.idDetalleProducto = this.kardexEncontrado.idDetalleProducto;
    this.kardexRetiroTemporalDTO.unidades = this.kardexEncontrado.unidades;
    this.kardexRetiroTemporalDTO.balance = this.kardexEncontrado.balance;
    this.kardexRetiroTemporalDTO.concepto = this.kardexEncontrado.concepto;
    this.kardexRetiroTemporalDTO.precioVenta = this.kardexEncontrado.precioVenta;
    this.kardexRetiroTemporalDTO.producto = this.kardexEncontrado.producto.idProducto;
    this.kardexRetiroTemporalDTO.costo = this.kardexEncontrado.costo;
    this.kardexRetiroTemporalDTO.persona = this.kardexEncontrado.persona;
    this.kardexRetiroTemporalDTO.codigoResponsable = this.itemForm.controls.autorizacionEmpleado.value;
    this.kardexRetiroTemporalDTO.esRetiro = this.kardexEncontrado.esRetiro;
    this.kardexRetiroTemporalDTO.fechaReIngreso = this.kardexEncontrado.fechaReIngreso;
    this.kardexRetiroTemporalDTO.finalizadoReingreso = true;
    this.kardexRetiroTemporalDTO.esRetiroTemporal = this.kardexEncontrado.esRetiroTemporal;
  }

  cambiaDetalle(){
    this.itemForm.controls.cantidadDetalle.setValue('');
    if(this.idDetalle != "-1"){
      const detalleActualizar = this.data.payload.detalles.find(x => x.idDetalleProducto === this.idDetalle);
      this.itemForm.controls.cantidadDetalle.setValue(detalleActualizar.cantidad);
    }    
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({            
      cantidad: ['', Validators.required],
      nombreProducto: [{value: item.nombre || '', disabled: true}],
      idProducto: [{value: item.idProducto || '', disabled: true}],
      concepto: ['', Validators.required],
      cantidadDetalle: [{value: '', disabled: true}],
      autorizacionEmpleado: ['', Validators.required],
      fecha: [],
    });
    this.kardexDTO.producto = item.idProducto;
    this.crearProductoDTO(item);
  }

  crearObjectoDetalleDTO(item){    
    const detalleActualizar = item.detalles.find(x => x.idDetalleProducto === this.idDetalle);
    this.detalleDTO.idDetalleProducto = detalleActualizar.idDetalleProducto;
    if(this.data.recibir == true){
      this.detalleDTO.cantidad = detalleActualizar.cantidad + this.itemForm.controls.cantidad.value;
    }else{
      this.detalleDTO.cantidad = detalleActualizar.cantidad - this.itemForm.controls.cantidad.value;      
    }
    this.detalleDTO.colorHexadecimal = detalleActualizar.colorHexadecimal;
    this.detalleDTO.colorNombre = detalleActualizar.colorNombre;
    this.detalleDTO.producto = item.idProducto;
    this.detalleDTO.talla = detalleActualizar.talla;
    this.detalleDTO.codigoResponsable = this.itemForm.controls.autorizacionEmpleado.value;
  }

  crearObjetoKardex(item){
    if(this.data.recibir == true){
      this.kardexDTO.balance = item.cantidadExistencias + this.itemForm.controls.cantidad.value;
      this.kardexDTO.unidades = this.itemForm.controls.cantidad.value;
      this.kardexDTO.esRetiro = false;
    }else{
      this.kardexDTO.balance = item.cantidadExistencias - this.itemForm.controls.cantidad.value;
      this.kardexDTO.unidades = -this.itemForm.controls.cantidad.value;
      this.kardexDTO.esRetiro = true;
    }
    this.kardexDTO.concepto = this.itemForm.controls.concepto.value;    
    this.kardexDTO.precioVenta = item.esLiquidacion === true ? item.precios.find(x => x.nombre === "precio1").precioVentaLiquidacion : item.precios.find(x => x.nombre === "precio1").precioVenta;
    this.kardexDTO.costo = item.costo;
    this.kardexDTO.idDetalleProducto = this.idDetalle;          
    this.kardexDTO.codigoResponsable = this.itemForm.controls.autorizacionEmpleado.value;
    this.kardexDTO.esRetiroTemporal = this.esRetiroTemporal;
    this.kardexDTO.fechaReIngreso = this.itemForm.controls.fecha.value;
    this.kardexDTO.finalizadoReingreso = false;
  }

  crearProductoDTO(item){
    this.productoDTO.idProducto = item.idProducto;
    this.productoDTO.codigoExterno = item.codigoExterno;
    this.productoDTO.cantidadExistencias = item.cantidadExistencias;
    this.productoDTO.cantidadMinima = item.cantidadMinima;
    this.productoDTO.nombre = item.nombre;
    this.productoDTO.descripcion = item.descripcion;
    this.productoDTO.esLiquidacion = item.esLiquidacion;
    this.productoDTO.costo = item.costo;
    this.productoDTO.marca = item.marca.idMarca;
    this.productoDTO.categoria = item.categoria.idCategoria;
    this.productoDTO.proveedor = item.proveedor.idProveedor;
    this.productoDTO.codigoResponsable = this.itemForm.controls.autorizacionEmpleado.value;
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
    this.funcionesService.obtenerEmpleados().subscribe(
      res => {
        this.listaEmpleados = res;
      },
      err => {
        this.reintento(err, nombresMetodos.cargarEmpleados);
      }
    );
  }

  retiroTemporal(){
    let tagIcono = this.iconoTemporalElement.nativeElement;
    let tagFecha = this.fechaReingresoElement.nativeElement;

    if(this.esRetiroTemporal == false){
      this.esRetiroTemporal = true;      
      tagFecha.classList.remove('invisible'); 
      tagIcono.classList.remove('colorGray');
      tagIcono.classList.add('colorGreen');
    }else{
      this.esRetiroTemporal = false; 
      tagIcono.classList.remove('colorGreen');
      tagFecha.classList.add('invisible');
      tagIcono.classList.add('colorGray');
      this.itemForm.controls.fecha.setValue(null);
    }

    if(this.data.recibir == true){
      this.itemForm.controls.concepto.setValue('Inclusión de mercadería');
    }else if(this.esRetiroTemporal == true){
      this.itemForm.controls.concepto.setValue('Retiro TEMPORAL de mercadería');
    }else{
      this.itemForm.controls.concepto.setValue('Retiro de mercadería');
    }
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
              }else if(metodo === nombresMetodos.obtenerKardex){
                this.obtenerKardex();
              }else if(metodo === nombresMetodos.finalizaKardexRetiroTemporal){
                this.finalizaKardexRetiroTemporal();
              }else if(metodo === nombresMetodos.retirar){
                this.retirar();
              }else if(metodo === nombresMetodos.recibir){
                this.recibir();
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
  cargarEmpleados = "cargarEmpleados",
  obtenerKardex = "obtenerKardex",
  finalizaKardexRetiroTemporal = "finalizaKardexRetiroTemporal",
  retirar = "retirar",
  recibir = "recibir"
}