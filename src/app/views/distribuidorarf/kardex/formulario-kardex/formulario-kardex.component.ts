import { Component, Inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-formulario-kardex',
  templateUrl: './formulario-kardex.component.html',
  styleUrls: ['./formulario-kardex.component.scss']
})
export class FormularioKardexComponent implements OnInit {

  public itemForm: FormGroup;
  token: Token = {
    access_token: null
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

  idDetalle: string = "-1";
  listaEmpleados: Persona[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormularioKardexComponent>,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private productosService: ProductosService,
    private userApiService: UserApiService,
    private kardexService: KardexService,
    private detallesProductosSerice: DetallesProductosService,
    private funcionesService: FuncionesService,
  ) { }

  ngOnInit(): void {    
    console.log(this.data.payload);    
    this.buildItemForm(this.data.payload);
    if(this.data.recibir == true){
      this.itemForm.controls.concepto.setValue('Inclusión de mercadería');
    }else{
      this.itemForm.controls.concepto.setValue('Retiro de mercadería');
    }
    this.userApiService.login().subscribe(
      res => {
        this.token = res;       
        this.cargarEmpleados();
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 4000 });
      }
    );        
  }

  submit(){
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
    console.log("Cantidad existencias: " + detalleActualizar.cantidad);
    if(this.itemForm.controls.cantidad.value > detalleActualizar.cantidad){      
      return false;
    }    
    return true;
  }

  retirar(){
    // -- inserta en kardex        
    this.kardexService.newRow(this.token.access_token, this.kardexDTO).subscribe(
      res => {
        console.log(res);
        // -- actualiza el detalle        
        this.detallesProductosSerice.update(this.token.access_token, this.detalleDTO.idDetalleProducto, this.detalleDTO).subscribe(
          res => {
            console.log(res);
            // -- actualiza el producto
            this.productoDTO.cantidadExistencias = this.productoDTO.cantidadExistencias - Math.abs(this.kardexDTO.unidades);
            this.productosService.update(this.token.access_token, this.productoDTO.idProducto, this.productoDTO).subscribe(
              res => {
                console.log(res);
                this.dialogRef.close(res);
              },
              err => {
                this.snack.open(err.message, "ERROR", { duration: 4000 }); 
              }
            );
          },
          err => {
            this.snack.open(err.message, "ERROR", { duration: 4000 });
          }
        );
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 4000 });
      }
    );
  }

  recibir(){
    // -- inserta en kardex        
    this.kardexService.newRow(this.token.access_token, this.kardexDTO).subscribe(
      res => {
        console.log(res);
        // -- actualiza el detalle        
        this.detallesProductosSerice.update(this.token.access_token, this.detalleDTO.idDetalleProducto, this.detalleDTO).subscribe(
          res => {
            console.log(res);
            // -- actualiza el producto
            this.productoDTO.cantidadExistencias = this.productoDTO.cantidadExistencias + Math.abs(this.kardexDTO.unidades);
            this.productosService.update(this.token.access_token, this.productoDTO.idProducto, this.productoDTO).subscribe(
              res => {
                console.log(res);
                this.dialogRef.close(res);
              },
              err => {
                this.snack.open(err.message, "ERROR", { duration: 4000 }); 
              }
            );
          },
          err => {
            this.snack.open(err.message, "ERROR", { duration: 4000 });
          }
        );
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 4000 });
      }
    );
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
      autorizacionEmpleado: ['', Validators.required]   
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
      console.log(element.tipoPersona);
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
        console.log(this.listaEmpleados);
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 4000 });
      }
    );
  }

}
