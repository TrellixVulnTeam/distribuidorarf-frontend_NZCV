import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Kardex } from 'app/interfaces/kardex';
import { Producto } from 'app/interfaces/producto';
import { Token } from 'app/interfaces/token';
import { KardexService } from 'app/services/kardex.service';
import { PersonaService } from 'app/services/persona.service';
import { ProductosService } from 'app/services/productos.service';
import { UserApiService } from 'app/services/user-api.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { FormularioKardexComponent } from './formulario-kardex/formulario-kardex.component';
import Swal from 'sweetalert2';
import { KardexDto } from 'app/interfaces/dto/kardex-dto';
import { DetallesProductosService } from 'app/services/detalles-productos.service';
import { ProductoDto } from 'app/interfaces/dto/producto-dto';
import { DetalleProductoDto } from 'app/interfaces/dto/detalle-producto-dto';
import { Persona } from 'app/interfaces/persona';
import { FuncionesService } from 'app/services/funciones.service';
import { StringManager } from 'app/managers/string-manager';
import { environment } from 'environments/environment';
import { ErrorBk } from 'app/interfaces/error-bk';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrls: ['./kardex.component.scss']
})
export class KardexComponent implements OnInit {

  public basicForm: FormGroup;
  items: Kardex[] = [];
  listaEmpleados: Persona[] = [];

  error: ErrorBk = {
    statusCode: null,
    message: null
  };

  token: Token = {
    access_token: null
  };

  intentos = 0;

  producto: Producto = {
    cantidadExistencias: null,
    cantidadMinima: null,
    categoria: null,
    codigoExterno: null,
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
    proveedor: null,
    codigoResponsable: null
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

  detalleDTO: DetalleProductoDto = {
    cantidad: null,
    colorHexadecimal: null,
    colorNombre: null,
    idDetalleProducto: null,
    producto: null,
    talla: null,
    codigoResponsable: null
  }

  cantidadVendidas: number = 0;
  strings = StringManager;
  serviceManager = ServiceManager;

  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService,
    private tokenService: UserApiService,
    private snack: MatSnackBar,
    private kardexService: KardexService,
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private personasService: PersonaService,
    private funcionesService: FuncionesService,
  ) { }

  ngOnInit(): void {
    this.buildItemForm();                
    this.cargarEmpleados();
  }

  buildItemForm(){
    this.basicForm = this.fb.group({
      id: ['', Validators.required],
      descripcion: [{ value:'', disabled: true }],
      existencias: [{ value:'', disabled: true }],
      vendidos: [{ value:'', disabled: true }],
      costo: [{ value:'', disabled: true }],
      precio1: [{ value:'', disabled: true }],
      cantidadMinima: [{ value:'', disabled: true }]
    });
  }

  limpiarFormulario(){
    this.basicForm.controls.descripcion.setValue('');
    this.basicForm.controls.costo.setValue('');
    this.basicForm.controls.existencias.setValue('');
    this.basicForm.controls.precio1.setValue('');
    this.basicForm.controls.cantidadMinima.setValue('');
    this.basicForm.controls.vendidos.setValue('');
    this.cantidadVendidas = 0;
    this.items = [];
  }

  buscarProducto(){
    this.loader.open();
    this.limpiarFormulario();
    
    if(this.basicForm.controls.id.value === null || this.basicForm.controls.id.value === ''){
      this.loader.close();
      this.snack.open(this.strings.msg_find_value, this.strings.alert_title, { duration: environment.TIEMPO_NOTIFICACION });          
      return;
    }

    this.productosService.getOne(this.basicForm.controls.id.value).subscribe(
      res => {
        this.producto = res;                      
        if(this.producto == null){
          this.loader.close();
          this.snack.open(this.strings.msg_producto_no_existe, this.strings.alert_title, { duration: environment.TIEMPO_NOTIFICACION });          
        }else{
          this.items = [];
          this.basicForm.controls.descripcion.setValue(this.producto.nombre);
          this.basicForm.controls.costo.setValue(this.producto.costo);
          this.basicForm.controls.existencias.setValue(this.producto.cantidadExistencias);
          this.basicForm.controls.precio1.setValue(this.producto.precios.find(x => x.nombre === "precio1").precioVenta);
          this.basicForm.controls.cantidadMinima.setValue(this.producto.cantidadMinima);
          // debe buscar los kadex asociados a ese producto          
          this.kardexService.getAll(this.producto.idProducto).subscribe(
            res => {              
              this.items = res;                            
              this.items.forEach(element => {                
                if(element.unidades < 0 && element.esRetiro != true){ //Cuando es retiro no se contabiliza en unidades vendidas.
                  this.cantidadVendidas = this.cantidadVendidas + Math.abs(element.unidades);                  
                }                
                if(element.persona != null){
                  this.personasService.getOne(element.persona).subscribe(
                    res => {
                      element.persona = res.nombre + ' ' + res.apellidos;
                    }
                  );
                }                

                let f = new Date(element.fechaUltimaModificacion.toLocaleString());                
                f.setHours(f.getHours() + (f.getTimezoneOffset() / 60) * -1);                
                element.fechaUltimaModificacion = f;

              });
              this.basicForm.controls.vendidos.setValue(this.cantidadVendidas);
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
                        this.buscarProducto();
                    },
                    err => {
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
      ,err => {
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
                  this.buscarProducto();
              },
              err => {
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

  openPopUp(data: any = {}, isNew?, idDevolucion?) {
    let title = isNew ? 'Recibir' : 'Retirar';

    if(this.producto.idProducto == null){
      this.snack.open("Debe buscar un producto para incluir existencias", "ERROR", { duration: 4000 });
    }else{
      let dialogRef: MatDialogRef<any> = this.dialog.open(FormularioKardexComponent, {
        width: '1020px',
        disableClose: true,
        data: { title: title, payload: this.producto, recibir: isNew, idDevolucion: idDevolucion }
      });
      dialogRef.afterClosed()
        .subscribe(res => {
          if(!res) {
            // If user press cancel
            return;
          }          
          if (isNew) {
            this.basicForm.controls.id.setValue(res.idProducto);
            this.buscarProducto();
          }else{
            this.basicForm.controls.id.setValue(res.idProducto);
            this.buscarProducto(); 
          }
        });
    }    
  }

  openPopUpBusqueda(data: any = {}){
    let title = 'Buscar Producto';
    let dialogRef: MatDialogRef<any> = this.dialog.open(BusquedaComponent, {
      width: '1020px',
      disableClose: true,
      data: { title: title, payload: this.producto}
    });
    dialogRef.afterClosed()
        .subscribe(res => {
          if(!res) {
            // If user press cancel
            return;
          }                    
          this.basicForm.controls.id.setValue(res);
          this.buscarProducto();
      });
  }

  devolver(row){
    Swal.fire({
      title: 'Devolver Producto?',
      text: "Desea devolver el producto al inventario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Guardar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.openPopUp({}, true, row.idKardex);
      }
    })
  }

  desechar(row){
    Swal.fire({
      title: 'Desechar Productos!!',
      text: "Desea desechar los productos definitivamente?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Desechar!',
      cancelButtonText: 'Cancelar',
      input: 'password',
      inputAttributes: {
        autocapitalize: 'off'
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        if(this.empleadoConAutrizacion(result.value) != true){
          this.snack.open("Código de autorización inválido.", "ERROR!!", { duration: 4000 }); 
        }else{
          this.finalizaKardexRetiroTemporal(row, result.value.codigo);
        }
      }
    })
  }

  finalizaKardexRetiroTemporal(item, codigo){
    this.crearObjetoKardexRetiroTemporalDTO(item, codigo);
    this.kardexService.update(item.idKardex, this.kardexRetiroTemporalDTO).subscribe(
      res => {
        this.snack.open("Productos desechados.", "Actualización!!", { duration: 4000 }); 
        this.buscarProducto();
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
                  this.finalizaKardexRetiroTemporal(item, codigo);
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

  crearObjetoKardexRetiroTemporalDTO(item, codigo){
    this.kardexRetiroTemporalDTO.idDetalleProducto = item.idDetalleProducto;
    this.kardexRetiroTemporalDTO.unidades = item.unidades;
    this.kardexRetiroTemporalDTO.balance = item.balance;
    this.kardexRetiroTemporalDTO.concepto = item.concepto;
    this.kardexRetiroTemporalDTO.precioVenta = item.precioVenta;
    this.kardexRetiroTemporalDTO.producto = item.producto.idProducto;
    this.kardexRetiroTemporalDTO.costo = item.costo;
    this.kardexRetiroTemporalDTO.persona = item.persona;
    this.kardexRetiroTemporalDTO.esRetiro = item.esRetiro;
    this.kardexRetiroTemporalDTO.codigoResponsable = codigo;
    this.kardexRetiroTemporalDTO.fechaReIngreso = item.fechaReIngreso;
    this.kardexRetiroTemporalDTO.finalizadoReingreso = true;
    this.kardexRetiroTemporalDTO.esRetiroTemporal = item.esRetiroTemporal;
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

}
