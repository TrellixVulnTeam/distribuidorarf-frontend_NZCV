import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FacturaDto } from 'app/interfaces/dto/factura-dto';
import { Factura } from 'app/interfaces/factura';
import { Persona } from 'app/interfaces/persona';
import { Termino } from 'app/interfaces/termino';
import { Token } from 'app/interfaces/token';
import { FacturasService } from 'app/services/facturas.service';
import { FuncionesService } from 'app/services/funciones.service';
import { TerminosService } from 'app/services/terminos.service';
import { UserApiService } from 'app/services/user-api.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { BuscarClienteComponent } from '../../proformas/detalle-proforma/buscar-cliente/buscar-cliente.component';
import Swal from 'sweetalert2';
import { DetalleProformaInsertarDto } from 'app/interfaces/dto/detalle-proforma-insertar-dto';
import { environment } from 'environments/environment';
import { StringManager } from 'app/managers/string-manager';
import { ServiceManager } from 'app/managers/service-manager';
import { ErrorBk } from 'app/interfaces/error-bk';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { DetallesProductosService } from 'app/services/detalles-productos.service';
import { BuscarProductoComponent } from '../../proformas/detalle-proforma/buscar-producto/buscar-producto.component';
import { Proforma } from 'app/interfaces/proforma';
import { ProformasService } from 'app/services/proformas.service';
import { DetallesProformasService } from 'app/services/detalles-proformas.service';
import { DetalleProforma } from 'app/interfaces/detalle-proforma';
import { ProformaDto } from 'app/interfaces/dto/proforma-dto';
import { Producto } from 'app/interfaces/producto';
import { PagoFacturaComponent } from '../pago-factura/pago-factura.component';

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
  selector: 'app-formulario-factura',
  templateUrl: './formulario-factura.component.html',
  styleUrls: ['./formulario-factura.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class FormularioFacturaComponent implements OnInit {

  @ViewChild('codProductoInput') codProductoInputElement!: ElementRef<HTMLInputElement>;
  @ViewChild('codProductoDeleteInput') codProductoDeleteInput!: ElementRef<HTMLInputElement>;

  cost = 0;
  totalFinal = 0;
  vat = 0;
  descuentoTotal = 0;
  cantProductos = 0;
  currency = '¢';
  showEditOption = true;
  proformaForm: FormGroup;
  productoForm: FormGroup;
  isLoading = false;
  terminos: Termino[] = [];
  posiblesClientes: Persona[] = [];
  precios = [{nombre: 'Precio 1', valor: environment.PRECIO1},{nombre: 'Precio 2', valor: environment.PRECIO2},{nombre: 'Precio 3', valor: environment.PRECIO3},{nombre: 'Precio 4', valor: environment.PRECIO4}];
  img: string;
  listaProductosResumen: ProductoResumen[] = [];
  listaEmpleados: Persona[] = [];
  tipoPrecioActual: number = 1;
  convertToInvoice: boolean = false;

  productoEncontrado: Producto = {
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

  profomaFormSubmit: ProformaDto = {
    idProforma: null,
    cantidadProductos: null,
    comentario: null,        
    estado: null,    
    fechaEmision: null,
    fechaVencimiento: null,
    persona: null,
    porcentajeDescuento: null,
    subTotal: null,
    total: null,
    borrado: null,
    codigoResponsable: null,
    vendedor: null,
    termino: null
  }

  proformaInsertada: Proforma;
  proforma: Proforma = {
    idProforma: null,
    cantidadProductos: null,
    comentario: null,
    estado: '',
    fechaEmision: null,
    fechaVencimiento: null,
    persona: null,
    porcentajeDescuento: null,
    subTotal: null,
    total: null,
    detallesProforma: null,
    facturas: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    termino: null,
    vendedor: null
  };
  detallesProforma: DetalleProformaInsertarDto[] = [];  
  detallesProformaList: DetalleProformaInsertarDto[] = [];  
  detallesProformaBorrar: DetalleProformaInsertarDto[] = [];
  detalles: DetalleProforma[] = [];
  detalleProformaInsertada: DetalleProformaInsertarDto;
  maxVersion: number = 0;
  products: ProductoResumen[] = [];

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
    private terminosService: TerminosService,
    private tokenService: UserApiService,
    private dialog: MatDialog,
    private funcionesService: FuncionesService,    
    private snack: MatSnackBar,
    private proformasService: ProformasService,
    private detallesProformasService: DetallesProformasService,
    private loader: AppLoaderService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private detallesProductosService: DetallesProductosService,
    private facturasService: FacturasService
  ) { }

  ngOnInit(): void {        
    this.buildProformaForm();        
    this.cargarTerminos();
    this.cargarEmpleados();
  } 

  getMaxVersion(idProforma: number): void {
    this.proformasService.maxVersion(idProforma).subscribe(
      res => {
        this.maxVersion = res[0].obtienemaximaversionxproforma;                
      },
      err => {
        this.reintento(err, nombresMetodos.getMaxVersion, null, null, null, idProforma);
      }
    );
  }

  buscarCliente(){
    this.posiblesClientes = [];        
    if(this.proformaForm.controls.identificacion.value === ''){
      let title = 'Buscar Cliente';
      let dialogRef: MatDialogRef<any> = this.dialog.open(BuscarClienteComponent, {
        width: '1020px',
        disableClose: true,
        data: { title: title, items: this.posiblesClientes}
      });
      dialogRef.afterClosed()
          .subscribe(res => {
            if(!res) {
              // If user press cancel
              return;
            }        
            this.proformaForm.patchValue({
              identificacion: res.identificacion,
              nombre: res.nombre,
              apellidos: res.apellidos,
              codigoResponsable: res.codigoResponsable,
              telefono: res.telefono1,
              correoElectronico: res.correoElectronico,
              direccion: res.direccion,
              idTermino: res.termino.idTermino,
              maxCredito: res.maxCredito,
              precio: res.precio
            });                        
        });
    }else{
      this.funcionesService.buscarClientes(this.proformaForm.controls.identificacion.value).subscribe(
        res => {
          this.posiblesClientes = res;
          if(this.posiblesClientes.length === 1){
            let date = new Date();
            date.setDate(date.getDate() + this.terminos.find(t => t.idTermino === +this.posiblesClientes[0].termino).valor);
            this.proformaForm.controls.fechaVencimiento.setValue(date);            
            this.proformaForm.patchValue({
              identificacion: this.posiblesClientes[0].identificacion,
              nombre: this.posiblesClientes[0].nombre,
              apellidos: this.posiblesClientes[0].apellidos,
              codigoResponsable: this.posiblesClientes[0].codigoResponsable,
              telefono: this.posiblesClientes[0].telefono1,
              correoElectronico: this.posiblesClientes[0].correoElectronico,
              direccion: this.posiblesClientes[0].direccion,
              idTermino: this.posiblesClientes[0].termino,
              maxCredito: this.posiblesClientes[0].maxCredito,
              precio: this.posiblesClientes[0].precio,
              termino: this.posiblesClientes[0].termino.idTermino
            });
          }else{
            let title = 'Buscar Cliente';
            let dialogRef: MatDialogRef<any> = this.dialog.open(BuscarClienteComponent, {
              width: '1020px',
              disableClose: true,
              data: { title: title, items: this.posiblesClientes}
            });
            dialogRef.afterClosed()
                .subscribe(res => {
                  if(!res) {
                    // If user press cancel
                    return;
                  }        
                  let date = new Date();            
                  date.setDate(date.getDate() + res.termino.valor);
                  this.proformaForm.controls.fechaVencimiento.setValue(date);
                  this.proformaForm.patchValue({
                    identificacion: res.identificacion,
                    nombre: res.nombre,
                    apellidos: res.apellidos,
                    codigoResponsable: res.codigoResponsable,
                    telefono: res.telefono1,
                    correoElectronico: res.correoElectronico,
                    direccion: res.direccion,
                    idTermino: res.termino.idTermino,
                    maxCredito: res.maxCredito,
                    precio: res.precio,
                    termino: res.termino.idTermino
                  });            
              });
          }
        },
        err => {
          this.reintento(err, nombresMetodos.buscarCliente);
        }
      );
    }
  }

  ngAfterContentInit(): void {    
    this.route.queryParams.subscribe(params => {
    if(params.id){
      this.loader.open();
      if(params.convertToInvoice)
        this.convertToInvoice = true;

      this.proformasService.getOne(params.id).subscribe(
        res => {                
          this.proforma = res;        

          this.getMaxVersion(this.proforma.idProforma);
          this.buildProformaForm(this.proforma);        
          this.cargarDetallesProforma(this.proforma.idProforma);
        }
      );
    }else{
      this.maxVersion = 1;
      this.proformaForm.controls.fechaEmision.setValue(new Date());
      this.proformaForm.controls.fechaVencimiento.setValue(new Date());
    }
  });  
  }

  cargarDetallesProforma(id){
    this.detallesProformasService.getByPreInvoice(id).subscribe(
      res => {
        this.detalles = res;     
        let indiceActual = 0;         
          this.funcionesService.listaProductosBusquedaFactura('precio1').subscribe(
            res => {
              this.products = res;

              this.detalles.forEach(detalle => {          
                this.detallesProformaList.push({
                  detalleProducto: detalle.detalleProducto.idDetalleProducto,
                  precioVenta: detalle.precioVenta,
                  descuento: detalle.descuento,
                  porcentajeDescuento: detalle.descuento,          
                  totalLinea: detalle.totalLinea,      
                  proforma: detalle.proforma.idProforma,
                  cantidad: detalle.cantidad,                      
                  codigoResponsable: detalle.codigoResponsable,      
                  persona: null,
                  precioInicial: detalle.precioInicial,
                  url: detalle.url,
                  detalleProforma: detalle.idDetalleProforma,
                  version: this.maxVersion,
                  nombre: detalle.detalleProducto.producto.nombre,
                  indice: indiceActual + 1,
                  lineaSeparada: detalle.lineaSeparada,
                  cantidadExistencias: this.products.find(x => x.iddetalleproducto == detalle.detalleProducto.idDetalleProducto).cantidadexistencias
                });

              this.invoiceItemFormArray.controls.push(
                this.fb.group({
                idDetalleProforma: [detalle.idDetalleProforma],
                idProducto: [detalle.detalleProducto.idDetalleProducto],     
                nombre: [detalle.detalleProducto.producto.nombre],       
                cantidad: [detalle.cantidad],
                precioUnitario: [detalle.precioVenta],
                descuento: [detalle.descuento],
                total: [detalle.totalLinea],  
                precioInicial: [detalle.precioInicial],
                url: [detalle.url],
                lineaSeparada: [detalle.lineaSeparada],
                indice: indiceActual + 1,
                cantidadExistencias: this.products.find(x => x.iddetalleproducto == detalle.detalleProducto.idDetalleProducto).cantidadexistencias
              }));  
              indiceActual += 1;     
              this.actualizaTotal();                      
            },
            err => {
              console.log(err);
            }         
          );             

          this.loader.close();
        });        
      }
    );
  }

  buildProformaForm(proforma?: Proforma){
    this.proformaForm = this.fb.group({
      numProforma: [proforma ? proforma.idProforma : ''],
      fechaEmision: [proforma ? proforma.fechaEmision : ''],
      fechaVencimiento: [proforma ? proforma.fechaVencimiento : Date.now()],
      identificacion: [proforma ? proforma.persona.identificacion : ''],
      status: [proforma ? 'pending' : 'pending'],
      nombre: [proforma ? proforma.persona.nombre : ''],
      apellidos: [proforma ? proforma.persona.apellidos : ''],
      codigoResponsable: [''],
      telefono: [proforma ? proforma.persona.telefono1 : ''],
      correoElectronico: [proforma ? proforma.persona.correoElectronico : ''],
      direccion: [proforma ? proforma.persona.direccion : ''],
      idTermino: [proforma ? proforma.termino.idTermino : ''],
      maxCredito: [proforma ? proforma.persona.maxCredito : ''],      
      codProducto: [''],
      comentarios: [''],
      precio: [proforma ? proforma.persona.precio : 1 ],
      item: this.fb.array([])
    });
    this.profomaFormSubmit.termino = proforma ? proforma.termino.idTermino : 0;
  }

  limpiarCliente(){
    this.proformaForm.patchValue({
      identificacion: '',
      nombre: '',
      apellidos: '',
      codigoResponsable: '',
      telefono: '',
      correoElectronico: '',
      direccion: '',
      idTermino: '',
      maxCredito: '',
      precio: 1
    });
  }

  cargarTerminos(){          
    this.terminosService.getAll().subscribe(
      res => {
        this.terminos = res;                    
      },
      err => {
        this.reintento(err, nombresMetodos.cargarTerminos);
      }
    );    
  }

  addNewItem(){
    let item: ProductoResumen;
    if(this.proformaForm.controls.codProducto.value === ''){      
      let title = 'Buscar Producto';
      let dialogRef: MatDialogRef<any> = this.dialog.open(BuscarProductoComponent, {
        width: '1020px',
        disableClose: true,
        data: { title: title, precio: 'precio' + this.proformaForm.controls.precio.value.toString()}
      });
      dialogRef.afterClosed()
          .subscribe(res => {
            if(!res) {
              // If user press cancel
              return;
            }   
            item = res;
            let index = -1;
            let indexActual = -1;

            this.invoiceItemFormArray.controls.forEach(element => {              
              indexActual++;
              if(element.value.idProducto === item.iddetalleproducto && element.value.lineaSeparada == false){
                index = indexActual;
              }
            });

            if(index != -1){
              if(this.invoiceItemFormArray.at(index).value.cantidadExistencias < this.invoiceItemFormArray.at(index).value.cantidad + 1){
                this.snack.open('No hay existencias suficientes para el producto ' + item.nombre, '', { duration: 3000 });
                return;
              }else{
                if(this.invoiceItemFormArray.at(index).value.cantidad < 1){
                  this.snack.open('La cantidad debe ser mayor a 0', '', { duration: 3000 });
                  return;
                }else{
                  this.invoiceItemFormArray.at(index).patchValue({ cantidad: +this.invoiceItemFormArray.at(index).value.cantidad + 1 });
                  this.invoiceItemFormArray.at(index).patchValue({ total: this.actualizaPrecio(this.invoiceItemFormArray.at(index).value.cantidad, this.invoiceItemFormArray.at(index).value.precioUnitario) });
                  this.actualizaTotal();
                }                
              }              
            }else{              
              let indiceBorrado = this.detallesProformaBorrar.findIndex(x => x.detalleProducto === item.iddetalleproducto);               
              if(indiceBorrado != -1){
                let fila = this.detallesProformaBorrar.find(x => x.detalleProducto === item.iddetalleproducto);
                // Inserta en fila en detallesproformalist
                this.detallesProformaList.push(fila);
                // --------------
                this.invoiceItemFormArray.push(
                  this.fb.group({
                    nombre: [item ? item.nombre : ''],
                    precioUnitario: [item ? item.precioventa : ''],
                    cantidad: [item ? 1 : ''],
                    idProducto: [item ? item.iddetalleproducto : ''],
                    total: [item ? this.actualizaPrecio(1, item.precioventa) : ''],
                    cantidadExistencias: [item ? item.cantidadexistencias : ''],
                    esLiquidacion: [item ? item.esliquidacion : ''],
                    descuento: [item ? item.porcentdescuento : ''],
                    url: [item ? item.url : ''],
                    precioInicial: [item ? item.precioinicial : ''],
                    idDetalleProforma: fila.detalleProforma,                    
                    lineaSeparada: fila.lineaSeparada,
                    indice: fila.indice
                  }));                
                this.detallesProformaBorrar.splice(indiceBorrado, 1);                
              }else{
                // Inserta en fila en detallesproformalist
                this.detallesProformaList.push(
                  {
                    cantidad: 1,
                    codigoResponsable: this.proformaForm.controls.codigoResponsable.value,
                    descuento: item ? item.porcentdescuento : 0,
                    detalleProducto: item.iddetalleproducto,
                    detalleProforma: null,
                    persona: null,
                    porcentajeDescuento: item ? item.porcentdescuento : 0,
                    precioInicial: item ? item.precioventa : 0,
                    precioVenta: item ? item.precioventa : 0,
                    proforma: null,
                    totalLinea: item ? item.precioventa : 0,
                    url: item ? item.url : '',
                    version: null,
                    nombre: item ? item.nombre : '',
                    lineaSeparada: false,
                    indice: this.detallesProformaList.length,
                    cantidadExistencias: item ? item.cantidadexistencias : 0
                  }                  
                );
                // --------------
                this.invoiceItemFormArray.push(
                  this.fb.group({
                    nombre: [item ? item.nombre : ''],
                    precioUnitario: [item ? item.precioventa : ''],
                    cantidad: [item ? 1 : ''],
                    idProducto: [item ? item.iddetalleproducto : ''],
                    total: [item ? this.actualizaPrecio(1, item.precioventa) : ''],
                    cantidadExistencias: [item ? item.cantidadexistencias : ''],
                    esLiquidacion: [item ? item.esliquidacion : ''],
                    descuento: [item ? item.porcentdescuento : ''],
                    url: [item ? item.url : ''],
                    precioInicial: [item ? item.precioinicial : ''],
                    lineaSeparada: false,
                    indice: this.detallesProformaList.length
                  })
                );                 
                this.img = item.url;                                
              }              
              this.actualizaTotal();
            }   
            this.codProductoInputElement.nativeElement.focus();
        });
    }else{       
      this.detallesProductosService.getProductToInvoice('precio' + this.proformaForm.controls.precio.value.toString(), this.proformaForm.controls.codProducto.value).subscribe(
        res => {                    
          let detalle: ProductoResumen;
          detalle = res[0];
          if(detalle === undefined){
            this.snack.open('No se encontró el producto', 'Cerrar', { duration: 5000 });
            return;
          }else{
            let index = -1;
            let indexActual = -1;         
            
            this.invoiceItemFormArray.controls.forEach(element => {              
              indexActual++;
              if(element.value.idProducto === detalle.iddetalleproducto && element.value.lineaSeparada == false){
                index = indexActual;
              }
            });

            if(index != -1){
              if(this.invoiceItemFormArray.at(index).value.cantidadExistencias < this.invoiceItemFormArray.at(index).value.cantidad + 1){
                this.snack.open('No hay existencias suficientes para el producto ' + res.idDetalleProducto, '', { duration: 3000 });
                return;
              }else{
                if(this.invoiceItemFormArray.at(index).value.cantidad < 1){
                  this.snack.open('La cantidad debe ser mayor a 0', '', { duration: 3000 });
                  return;
                }else{
                  this.invoiceItemFormArray.at(index).patchValue({ cantidad: +this.invoiceItemFormArray.at(index).value.cantidad + 1 });
                  this.invoiceItemFormArray.at(index).patchValue({ total: this.actualizaPrecio(this.invoiceItemFormArray.at(index).value.cantidad, this.invoiceItemFormArray.at(index).value.precioUnitario) });                  
                  this.actualizaTotal();
                }                
              }              
            }else{              
              let indiceBorrado = this.detallesProformaBorrar.findIndex(x => x.detalleProducto === item.iddetalleproducto);               
              if(indiceBorrado != -1){
                let fila = this.detallesProformaBorrar.find(x => x.detalleProducto === item.iddetalleproducto);
                // Inserta en fila en detallesproformalist
                this.detallesProformaList.push(fila);
                // --------------
                this.invoiceItemFormArray.push(
                  this.fb.group({
                    nombre: [item ? item.nombre : ''],
                    precioUnitario: [item ? item.precioventa : ''],
                    cantidad: [item ? 1 : ''],
                    idProducto: [item ? item.iddetalleproducto : ''],
                    total: [item ? this.actualizaPrecio(1, item.precioventa) : ''],
                    cantidadExistencias: [item ? item.cantidadexistencias : ''],
                    esLiquidacion: [item ? item.esliquidacion : ''],
                    descuento: [item ? item.porcentdescuento : ''],
                    url: [item ? item.url : ''],
                    precioInicial: [item ? item.precioinicial : ''],
                    idDetalleProforma: fila.detalleProforma,
                    lineaSeparada: fila.lineaSeparada,
                    indice: fila.indice
                  }));                
                this.detallesProformaBorrar.splice(indiceBorrado, 1);                
              }else{
                // Inserta en fila en detallesproformalist
                this.detallesProformaList.push(
                  {
                    cantidad: 1,
                    codigoResponsable: this.proformaForm.controls.codigoResponsable.value,
                    descuento: item ? item.porcentdescuento : 0,
                    detalleProducto: item.iddetalleproducto,
                    detalleProforma: null,
                    persona: null,
                    porcentajeDescuento: item ? item.porcentdescuento : 0,
                    precioInicial: item ? item.precioventa : 0,
                    precioVenta: item ? item.precioventa : 0,
                    proforma: null,
                    totalLinea: item ? item.precioventa : 0,
                    url: item ? item.url : '',
                    version: null,
                    nombre: item ? item.nombre : '',
                    lineaSeparada: false,
                    indice: this.detallesProformaList.length,
                    cantidadExistencias: detalle ? detalle.cantidadexistencias : 0                    
                  }                  
                );
                // --------------
                this.invoiceItemFormArray.push(
                  this.fb.group({
                    nombre: [detalle ? detalle.nombre : ''],
                    precioUnitario: [detalle ? detalle.precioventa : ''],
                    cantidad: [detalle ? 1 : ''],
                    idProducto: [detalle ? detalle.iddetalleproducto : ''],
                    total: [detalle ? this.actualizaPrecio(1, detalle.precioventa) : ''],
                    cantidadExistencias: [detalle ? detalle.cantidadexistencias : ''],
                    esLiquidacion: [detalle ? detalle.esliquidacion : ''],
                    descuento: [detalle ? detalle.porcentdescuento : ''],
                    url: [detalle ? detalle.url : ''],
                    precioInicial: [detalle ? detalle.precioinicial : ''],
                    lineaSeparada: false,
                    indice: this.detallesProformaList.length
                  })
                );                  
                this.img = detalle.url;                                   
              }              
              this.actualizaTotal();
            }        
            this.codProductoInputElement.nativeElement.focus();          
            this.proformaForm.controls.codProducto.setValue('');
          }
        },
        err => {
          this.reintento(err, nombresMetodos.addNewItem);
        }
      );
    }    
  }

  discountItem(iddetalleproducto: string){    
    let index = -1;
    let indexActual = -1;
    this.invoiceItemFormArray.controls.forEach(element => {
      indexActual++;
      if(element.value.idProducto === iddetalleproducto &&  element.value.lineaSeparada == false){
        index = indexActual;
      }
    });
    if(index != -1){
      if(this.invoiceItemFormArray.at(index).value.cantidad > 1){
        this.invoiceItemFormArray.at(index).patchValue({ cantidad: this.invoiceItemFormArray.at(index).value.cantidad - 1 });
        this.invoiceItemFormArray.at(index).patchValue({ total: this.actualizaPrecio(this.invoiceItemFormArray.at(index).value.cantidad, this.invoiceItemFormArray.at(index).value.precioUnitario) });        
        this.actualizaTotal();
      }else{        
        if(this.invoiceItemFormArray.at(index).value.idDetalleProforma != null){
          this.detallesProformaBorrar.push(
            {
              detalleProducto: this.invoiceItemFormArray.at(index).value.idProducto,
              detalleProforma: this.invoiceItemFormArray.at(index).value.idDetalleProforma,
              descuento: this.invoiceItemFormArray.at(index).value.descuento,
              porcentajeDescuento: this.invoiceItemFormArray.at(index).value.descuento,
              cantidad: this.invoiceItemFormArray.at(index).value.cantidad,
              precioVenta: this.invoiceItemFormArray.at(index).value.precioUnitario,
              totalLinea: this.invoiceItemFormArray.at(index).value.total,
              precioInicial: this.invoiceItemFormArray.at(index).value.precioInicial,
              url: this.invoiceItemFormArray.at(index).value.url,
              proforma: this.proforma.idProforma,
              codigoResponsable: this.proformaForm.controls.codigoResponsable.value,
              persona: this.proformaForm.controls.identificacion.value,
              version: this.maxVersion,
              nombre: this.invoiceItemFormArray.at(index).value.nombre,
              lineaSeparada: this.invoiceItemFormArray.at(index).value.lineaSeparada,
              indice: this.detallesProformaBorrar.length + 1,
              cantidadExistencias: this.invoiceItemFormArray.at(index).value.cantidadExistencias
            });
            this.invoiceItemFormArray.removeAt(index);
        }          
        this.actualizaTotal();
      }
    }
    this.codProductoDeleteInput.nativeElement.focus();
    this.proformaForm.controls.codProducto.setValue('');
  }

  cambiarPrecioXCantidad(precio: number, cantidad: number, idProducto: string, indice: number){        
    let index = -1;
    let indexActual = -1;        
    let cantidadTotalXProducto: number = 0;

    this.invoiceItemFormArray.controls.forEach(element => {              
      indexActual++;
      if(indice != -1){
        if(element.value.idProducto === idProducto && element.value.indice == indice){
          index = indexActual;           
        }
        if(element.value.idProducto === idProducto)
          cantidadTotalXProducto += +element.value.cantidad;
      }else{
        if(element.value.idProducto === idProducto){
          index = indexActual; 
          cantidadTotalXProducto += +element.value.cantidad;
        }
      }    
    });    

    if(this.invoiceItemFormArray.at(index).value.cantidadExistencias < cantidadTotalXProducto){
      this.snack.open('No hay existencias suficientes', '', { duration: 3000 });
      this.invoiceItemFormArray.at(index).patchValue(
        { 
          cantidad: 1, 
          total: this.actualizaPrecio(1, precio),
          descuento: this.actualizaPorcentajeDescuento(this.invoiceItemFormArray.at(index).value.precioInicial, precio).toFixed(2)
        }
      );
      this.img = this.invoiceItemFormArray.at(index).value.url;
      this.actualizaTotal();
    }else if(cantidad < 1){
      this.snack.open('La cantidad debe ser mayor a 0', '', { duration: 3000 });
      this.invoiceItemFormArray.at(index).patchValue({ cantidad: 1 });
      this.invoiceItemFormArray.at(index).patchValue({ descuento: this.actualizaPorcentajeDescuento(this.invoiceItemFormArray.at(index).value.precioInicial, precio).toFixed(2)});
      this.detallesProformaList.find(x => x.indice == indice).cantidad = 1;
      this.detallesProformaList.find(x => x.indice == indice).descuento = this.actualizaPorcentajeDescuento(this.invoiceItemFormArray.at(index).value.precioInicial, precio);
      this.img = this.invoiceItemFormArray.at(index).value.url;
    }else if(this.invoiceItemFormArray.at(index).value.precioUnitario <= this.invoiceItemFormArray.at(index).value.precioInicial){      
      this.invoiceItemFormArray.at(index).patchValue({ total: this.actualizaPrecio(precio, cantidad) });
      this.invoiceItemFormArray.at(index).patchValue({ descuento: this.actualizaPorcentajeDescuento(this.invoiceItemFormArray.at(index).value.precioInicial, precio).toFixed(2)});      
      this.detallesProformaList.find(x => x.indice == indice).totalLinea = this.actualizaPrecio(precio, cantidad);
      this.detallesProformaList.find(x => x.indice == indice).descuento = this.actualizaPorcentajeDescuento(this.invoiceItemFormArray.at(index).value.precioInicial, precio);
      this.detallesProformaList.find(x => x.indice == indice).cantidad = cantidad;
      this.img = this.invoiceItemFormArray.at(index).value.url;
      this.actualizaTotal();
    }else{
      this.invoiceItemFormArray.at(index).patchValue({ total: this.actualizaPrecio(precio, cantidad), descuento: 0 });
      this.detallesProformaList.find(x => x.indice == indice).totalLinea = this.actualizaPrecio(precio, cantidad);
      this.detallesProformaList.find(x => x.indice == indice).descuento = 0;
      this.detallesProformaList.find(x => x.indice == indice).cantidad = cantidad;
      this.img = this.invoiceItemFormArray.at(index).value.url;
      this.actualizaTotal();
    }    
  }

  actualizaPorcentajeDescuento(precioInicial, precioUnitario ){
    let porcentajeDescuento = (precioInicial - precioUnitario) / precioInicial * 100;
    if(porcentajeDescuento < 0){
      porcentajeDescuento = 0;
    }
    return porcentajeDescuento;
  }

  cargarVistaPrevia(idProducto: string){
    let index = -1;
    let indexActual = -1;

    this.invoiceItemFormArray.controls.forEach(element => {              
      indexActual++;
      if(element.value.idProducto === idProducto){
        index = indexActual;        
      }
    });
    this.img = this.invoiceItemFormArray.at(index).value.url;    
  }

  actualizaPrecio(precio: number, cantidad: number){
    return precio * cantidad;
  }

  actualizaDescuento(idProducto: string, indice: number){    
    let index = -1;
    let indexActual = -1;

    this.invoiceItemFormArray.controls.forEach(element => {              
      indexActual++;
      if(element.value.idProducto === idProducto){
        index = indexActual;        
      }
    });

    if(this.invoiceItemFormArray.at(index).value.descuento < 0){
      this.snack.open('No se puede aplicar descuento a un producto con precio negativo', 'ERROR!!!', { duration: 3000 });
      this.invoiceItemFormArray.at(index).patchValue({ descuento: 0 });
      this.cambiarPrecioXCantidad(this.invoiceItemFormArray.at(index).value.precioUnitario, this.invoiceItemFormArray.at(index).value.cantidad, idProducto, indice);
      this.actualizaTotal();    
    }
    else if(this.invoiceItemFormArray.at(index).value.descuento > 100){
      this.snack.open('No se puede aplicar un descuento mayor a 100%', 'ERROR!!!', { duration: 3000 });
      this.invoiceItemFormArray.at(index).patchValue({ descuento: 0 });
      this.cambiarPrecioXCantidad(this.invoiceItemFormArray.at(index).value.precioUnitario, this.invoiceItemFormArray.at(index).value.cantidad, idProducto, indice);
      this.actualizaTotal();    
    }
    else{    
      if(this.invoiceItemFormArray.at(index).value.descuento >= 0 && this.invoiceItemFormArray.at(index).value.precioUnitario <= this.invoiceItemFormArray.at(index).value.precioInicial){
        this.invoiceItemFormArray.at(index).patchValue({ precioUnitario: (this.invoiceItemFormArray.at(index).value.precioInicial - (this.invoiceItemFormArray.at(index).value.precioInicial * this.invoiceItemFormArray.at(index).value.descuento / 100)).toFixed(2) });
        this.cambiarPrecioXCantidad(this.invoiceItemFormArray.at(index).value.precioUnitario, this.invoiceItemFormArray.at(index).value.cantidad, idProducto, indice);
        this.actualizaTotal();    
      }else if(this.invoiceItemFormArray.at(index).value.precioUnitario > this.invoiceItemFormArray.at(index).value.precioInicial){
        this.snack.open('No se puede aplicar un descuento sobre un precio mayor al inicial', 'ERROR!!!', { duration: 5000 });
        this.invoiceItemFormArray.at(index).patchValue({
          descuento: 0
        });
      }else{        
        this.invoiceItemFormArray.at(index).patchValue({
          descuento: 0
        });
      }      
    }    
  }

  actualizaTotal(){    
    this.cost = 0;
    this.totalFinal = 0;
    this.descuentoTotal = 0;
    this.cantProductos = 0;
    this.invoiceItemFormArray.controls.forEach(element => {                    
      this.cost += (+element.value.precioUnitario > +element.value.precioInicial ? +element.value.precioUnitario : +element.value.precioInicial) * +element.value.cantidad;
      this.cost = +this.cost.toFixed(2);
      this.totalFinal += +element.value.total;
      this.totalFinal = +this.totalFinal.toFixed(2);
      this.cantProductos += +element.value.cantidad;
    });

    let descuento = +((this.cost - this.totalFinal)).toFixed(2);
    if(descuento > 0)
      this.descuentoTotal = +((this.cost - this.totalFinal)).toFixed(2);

  }

  get invoiceItemFormArray(): FormArray {
    return this.proformaForm.get('item') as FormArray;
  }

  changeTermino(value){
    this.profomaFormSubmit.termino = value;    
    let date = new Date();
    date.setDate(date.getDate() + this.terminos.find(t => t.idTermino === value).valor);
    this.proformaForm.controls.fechaVencimiento.setValue(date);
  }

  obtieneProductosXPrecio(value){
    Swal.fire({
      title: 'Cambiar Precio!!',
      text: "Cambiar el precio actualizará todos los precios de todas las líneas de la proforma?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Actualizar!',
      cancelButtonText: 'Cancelar',      
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoPrecioActual = value;
        this.funcionesService.listaProductosBusquedaFactura('precio' + value).subscribe(
          res => {        
            this.listaProductosResumen = res;            
            this.actualizaTodosLosPrecios();
          },
          err => {
            // this.snack.open('Error al obtener los productos: ' + err, 'ERROR!!!', { duration: 3000 });
            this.reintento(err, nombresMetodos.obtieneProductosXPrecio, value);
          }         
        );
      }else{
        this.proformaForm.patchValue({ precio: this.tipoPrecioActual });
      }
    });    
  }

  actualizaTodosLosPrecios(){
    this.invoiceItemFormArray.controls.forEach(element => {
      let producto = this.listaProductosResumen.find(item => item.iddetalleproducto === element.value.idProducto);      
      element.patchValue(
        {
          descuento: producto.porcentdescuento,
          precioInicial: producto.precioinicial,
          precioUnitario: (producto.precioinicial - (producto.precioinicial * producto.porcentdescuento / 100)).toFixed(2)
        }
      );      
      this.cambiarPrecioXCantidad(element.value.precioUnitario, element.value.cantidad, element.value.idProducto, -1);
    });
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

  crearProforma(){
    this.profomaFormSubmit.cantidadProductos = this.cantProductos;
    this.profomaFormSubmit.fechaEmision = this.proformaForm.controls.fechaEmision.value;
    this.profomaFormSubmit.fechaVencimiento = this.proformaForm.controls.fechaVencimiento.value;
    this.profomaFormSubmit.comentario = this.proformaForm.controls.comentarios.value;
    this.profomaFormSubmit.termino = this.proformaForm.controls.idTermino.value;    
    const d1 = new Date();
      const fechaHoy = new Date(
          Date.UTC(
              d1.getUTCFullYear(),
              d1.getUTCMonth(),
              d1.getUTCDate(),
              d1.getUTCHours(),
              d1.getUTCMinutes(),
              d1.getUTCSeconds(),
              d1.getUTCMilliseconds(),
          ),
      );
    this.profomaFormSubmit.estado = this.strings.label_estado_finalizada;
    this.profomaFormSubmit.persona = this.proformaForm.controls.identificacion.value;
    this.profomaFormSubmit.porcentajeDescuento = this.descuentoTotal;
    this.profomaFormSubmit.total = this.totalFinal;
    this.profomaFormSubmit.subTotal = this.cost;  
    this.profomaFormSubmit.codigoResponsable = this.proformaForm.controls.codigoResponsable.value;
    this.profomaFormSubmit.vendedor = this.listaEmpleados.find(item => item.codigoResponsable === this.proformaForm.controls.codigoResponsable.value).identificacion;    
  } 

  crearListaDetallesProforma(id: number){            
    this.detallesProforma = this.invoiceItemFormArray.controls
    .map(element => ({
      detalleProducto: element.value.idProducto,
      cantidad: element.value.cantidad,
      precioVenta: element.value.precioUnitario,
      totalLinea: element.value.total,
      descuento: element.value.descuento,
      porcentajeDescuento: element.value.descuento,          
      proforma: id,
      codigoResponsable: this.proformaForm.controls.codigoResponsable.value,
      persona: this.proformaForm.controls.identificacion.value,
      precioInicial: element.value.precioInicial,
      url: element.value.url,
      detalleProforma: element.value.idDetalleProforma,
      version: this.maxVersion,
      nombre: element.value.nombre,
      lineaSeparada: element.value.lineaSeparada,
      indice: this.detallesProforma.length + 1,
      cantidadExistencias: element.value.cantidadExistencias
    }));       
  }

  guardarProforma() {    
    this.isLoading = true;
    if (this.proformaForm.valid) {
      // this.loader.open();                 
      let dialogRef: MatDialogRef<any> = this.dialog.open(PagoFacturaComponent, {
        width: '900',
        disableClose: true,
        data: { title: this.strings.titulo_pago_factura }
      });
      // this.crearProforma();            
      // this.insertarNuevaProforma();      
    }else{      
      this.isLoading = false;
    }
  }  

  createInvoice(idProforma: number, codigoResponsable: string, monto: number){
    let invoice: invoiceLite = {
      idProforma: idProforma,
      codigoResponsable: codigoResponsable,
      monto: monto
    };    
    this.createInvoiceCallService(invoice);    
  }

  createInvoiceCallService(invoice){
    this.facturasService.createInvoice(invoice).subscribe(
      res =>{
        this.isLoading = false;
        this.loader.close();   
        this.router.navigate(['/facturas']);             
      },
      err => {
        this.reintento(err, nombresMetodos.createInvoiceCallService, invoice);
      }
    );
  }

  insertarNuevaProforma(){
    this.proformasService.newRow(this.profomaFormSubmit).subscribe(
      res => {
        this.proformaInsertada = res;
        console.log(this.proformaInsertada);
        // Luego se crean los items de la proforma - actualizar kardex y descontar existencias [esto se hace con un procedimiento almacenado]
        this.crearListaDetallesProforma(this.proformaInsertada.idProforma);
        let cantidadLineas = this.detallesProforma.length;
        let cuentaLineasInsertadas = 0;
        this.detallesProforma.forEach(element => {          
          this.detallesProformasService.insertFullPreInvoice(element).subscribe(
            res => {                
              cuentaLineasInsertadas++;
              let mensajeReturn = res;        
              if(cuentaLineasInsertadas === cantidadLineas){
                // this.loader.close();
                // this.isLoading = false;
                // this.snack.open("Proforma guardada con éxito", "OK", { duration: 4000 });
                // this.router.navigate(['/proformas/listado-proformas']);
                this.createInvoice(this.proformaInsertada.idProforma, this.proformaForm.controls.codigoResponsable.value, this.totalFinal);
              }
            },
            err => {
              this.reintento(err, nombresMetodos.insertarNuevaProforma);
            }
          );
        });
        this.loader.close();           
      },
      err => {
        this.loader.close();           
        this.reintento(err, 'insertarNuevaProforma');
      }   
    );
  }

  sortType: string = 'asc';

  sortItems(sortColumn){
    this.invoiceItemFormArray.clear();   
    if(sortColumn === 'codigo'){      
      if(this.sortType === 'asc'){
        this.detallesProformaList.sort((a,b) => a.detalleProducto.toUpperCase() > b.detalleProducto.toUpperCase() ? 1 : a.detalleProducto.toUpperCase() === b.detalleProducto.toUpperCase() ? 0 : -1);
        this.sortType = 'desc'
      }else{
        this.detallesProformaList.sort((a,b) => a.detalleProducto.toUpperCase() < b.detalleProducto.toUpperCase() ? 1 : a.detalleProducto.toUpperCase() === b.detalleProducto.toUpperCase() ? 0 : -1);
        this.sortType = 'asc'
      }      
      this.detallesProformaList.forEach(
        element => {
          this.invoiceItemFormArray.push(
            this.fb.group({
              nombre: [element ? element.nombre : ''],
              precioUnitario: [element ? element.precioVenta : ''],
              cantidad: [element ? element.cantidad : ''],
              idProducto: [element ? element.detalleProducto : ''],
              total: [element ? this.actualizaPrecio(element.cantidad, element.precioVenta) : ''],
              cantidadExistencias: [element ? element.cantidadExistencias : ''],
              esLiquidacion: [element ? '' : ''],
              descuento: [element ? element.descuento : ''],
              url: [element ? element.url : ''],
              precioInicial: [element ? element.precioInicial : ''],
              idDetalleProforma: [element ? element.detalleProforma : ''],
              indice: element.indice,
              lineaSeparada: element.lineaSeparada
            })
          );                                      
        }
      );
    }else if(sortColumn === 'nombre'){
      if(this.sortType === 'asc'){
        this.detallesProformaList.sort((a,b) => a.nombre.toUpperCase() > b.nombre.toUpperCase() ? 1 : a.nombre.toUpperCase() === b.nombre.toUpperCase() ? 0 : -1);
        this.sortType = 'desc'
      }else{
        this.detallesProformaList.sort((a,b) => a.nombre.toUpperCase() < b.nombre.toUpperCase() ? 1 : a.nombre.toUpperCase() === b.nombre.toUpperCase()? 0 : -1);
        this.sortType = 'asc'
      }      
      this.detallesProformaList.forEach(
        element => {
          this.invoiceItemFormArray.push(
            this.fb.group({
              nombre: [element ? element.nombre : ''],
              precioUnitario: [element ? element.precioVenta : ''],
              cantidad: [element ? element.cantidad : ''],
              idProducto: [element ? element.detalleProducto : ''],
              total: [element ? this.actualizaPrecio(element.cantidad, element.precioVenta) : ''],
              cantidadExistencias: [element ? element.cantidadExistencias : ''],
              esLiquidacion: [element ? '' : ''],
              descuento: [element ? element.descuento : ''],
              url: [element ? element.url : ''],
              precioInicial: [element ? element.precioInicial : ''],
              idDetalleProforma: [element ? element.detalleProforma : ''] ,
              indice: element.indice,
              lineaSeparada: element.lineaSeparada
            })
          );                                      
        });
    }    
  }

  borrarLinea(idproducto: number, indice: number){    
    let v = this.invoiceItemFormArray.controls.find(element => element.value.idProducto === idproducto && element.value.indice == indice);    
    if(v.value.idDetalleProforma != undefined){
      this.detallesProformaBorrar.push(
        {
          detalleProducto: v.value.idProducto,
          detalleProforma: v.value.idDetalleProforma,
          descuento: v.value.descuento,
          porcentajeDescuento: v.value.descuento,
          cantidad: v.value.cantidad,
          precioVenta: v.value.precioUnitario,
          totalLinea: v.value.total,
          precioInicial: v.value.precioInicial,
          url: v.value.url,
          proforma: this.proforma.idProforma,
          codigoResponsable: this.proformaForm.controls.codigoResponsable.value,
          persona: this.proformaForm.controls.identificacion.value,
          version: this.maxVersion,
          nombre: v.value.nombre,
          lineaSeparada: v.value.lineaSeparada,
          indice: this.detallesProformaBorrar.length + 1,
          cantidadExistencias: v.value.cantidadExistencias
        }
      );  
    }

    let index = this.invoiceItemFormArray.controls.findIndex(element => element.value.idProducto === idproducto && element.value.indice == indice);
    this.invoiceItemFormArray.removeAt(index);            
    this.actualizaTotal();
  }

  separarProducto(idProduct: string){
    let v = this.invoiceItemFormArray.controls.find(element => element.value.idProducto === idProduct && element.value.lineaSeparada == false);
    v.patchValue({
      cantidad: v.value.cantidad - 1,
      total: this.actualizaPrecio(v.value.precioUnitario, (v.value.cantidad - 1))
    });       

    let newIndex = this.detallesProformaList.length + 1;

    this.detallesProformaList.push({
      cantidad: v.value.cantidad,
      cantidadExistencias: v.value.cantidadExistencias,
      codigoResponsable: '',
      descuento: v.value.descuento,
      detalleProducto: v.value.idProducto,
      detalleProforma: v.value.detalleProfoma,
      indice: newIndex,
      lineaSeparada: true,
      nombre: v.value.nombre,
      persona: '',
      porcentajeDescuento: v.value.descuento,
      precioInicial: v.value.precioInicial,
      precioVenta: v.value.precioVenta,
      proforma: null,
      totalLinea: this.actualizaPrecio(v.value.precioUnitario, 1),
      url: v.value.url,
      version: this.maxVersion
    });

    this.invoiceItemFormArray.push(
      this.fb.group({
        nombre: v.value.nombre,
        precioUnitario: v.value.precioUnitario,
        cantidad: 1,
        idProducto: v.value.idProducto,
        total: this.actualizaPrecio(v.value.precioUnitario, 1),
        cantidadExistencias: v.value.cantidadExistencias,
        esLiquidacion: v.value.esLiquidacion,
        descuento: v.value.descuento,
        url: v.value.url,
        precioInicial: v.value.precioInicial,
        lineaSeparada: true,
        indice: newIndex
      })
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
              }else if(metodo === nombresMetodos.insertarNuevaProforma){
                this.insertarNuevaProforma();
              }else if(metodo === nombresMetodos.createInvoiceCallService){
                this.createInvoiceCallService(data);
              }else if(metodo === nombresMetodos.obtieneProductosXPrecio){
                this.obtieneProductosXPrecio(data);
              }else if(metodo === nombresMetodos.addNewItem){
                this.addNewItem();
              }else if(metodo === nombresMetodos.cargarTerminos){
                this.cargarTerminos();
              }else if(metodo === nombresMetodos.cargarDetallesProforma){
                this.cargarDetallesProforma(id);
              }else if(metodo === nombresMetodos.buscarCliente){
                this.buscarCliente(); 
              }else if(metodo === nombresMetodos.getMaxVersion){
                this.getMaxVersion(id);
              }else{
                this.snack.open(this.strings.error_mgs_metodo_no_encontrado + metodo, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });
              }
          },
          err => {
            this.intentos = 1;
            this.loader.close(); 
            this.isLoading = false;
            this.snack.open(err.message, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });
          }
        );              
      }else{
        this.intentos = 1;
        this.loader.close();
        this.isLoading = false;
        this.snack.open(this.strings.factura_error_lista + err.message, this.strings.cerrar_title, { duration: environment.TIEMPO_NOTIFICACION });
      }
    }
  }

}

export interface invoiceLite{
  idProforma: number;
  codigoResponsable: string;
  monto: number;
}

export interface ProformaItem {
  nombre: string;
  precioUnitario: number[];
  total: number;
  cantidad: number;
  idProducto: string;  
  cantidadexistencias: number,
  esLiquidacion: boolean,
  descuento: number,
  url: string,
  precioInicial: number,
}

export interface ProductoResumen {
  iddetalleproducto: string;
  idproducto: string,
  nombre: string,
  cantidadexistencias: number,
  url: string,
  precioventa: number,
  esliquidacion: boolean,
  porcentdescuento: number,
  precioinicial: number,
  talla: string
}

enum nombresMetodos {  
  cargarEmpleados = 'cargarEmpleados',  
  cargarMarcas = 'cargarMarcas',
  cargarProveedores = 'cargarProveedores',
  insertarNuevaProforma = 'insertarNuevaProforma',
  createInvoiceCallService = 'createInvoiceCallService',
  obtieneProductosXPrecio = 'obtieneProductosXPrecio',
  addNewItem = 'addNewItem',
  cargarTerminos = 'cargarTerminos',
  cargarDetallesProforma = 'cargarDetallesProforma',
  buscarCliente = 'buscarCliente',
  getMaxVersion = 'getMaxVersion'
}
