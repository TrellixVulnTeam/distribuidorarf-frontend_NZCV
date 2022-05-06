import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MarcaDto } from 'app/interfaces/dto/marca-dto';
import { Marca } from 'app/interfaces/marca';
import { Token } from 'app/interfaces/token';
import { FuncionesService } from 'app/services/funciones.service';
import { MarcasService } from 'app/services/marcas.service';
import { UserApiService } from 'app/services/user-api.service';

@Component({
  selector: 'app-marca-popup',
  templateUrl: './marca-popup.component.html',
  styleUrls: ['./marca-popup.component.scss']
})
export class MarcaPopupComponent implements OnInit {

  public itemForm: FormGroup;
  esEditar: boolean = false;
  marcas: Marca[] = [];
  listaEmpleados: any[] = [];

  marcaDTO: MarcaDto = {
    descripcion: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    idMarca: null,
    nombre: null,
    codigoResponsable: null
  }

  marca: Marca = {
    descripcion: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    idMarca: null,
    nombre: null,
    codigoResponsable: null
  }

  token: Token = {
    access_token: ``
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MarcaPopupComponent>,
    private fb: FormBuilder,
    private userApiService: UserApiService,
    private snack: MatSnackBar,
    private marcasService: MarcasService,
    private funcionesService: FuncionesService,
  ) { }

  ngOnInit(): void {
    this.buildItemForm(this.data.payload);  
    this.userApiService.login().subscribe(
      res => {
        this.token = res;               
        this.cargarEmpleados();
        if(this.data.payload.idMarca != '' && this.data.payload.idMarca != null){      
          this.marcaDTO.idMarca = this.data.payload.idMarca;
          this.esEditar = true;
        }                 
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 4000 });
      }
    );  
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({            
      nombre: [item.nombre || '', Validators.required],
      descripcion: [item.descripcion || ''],      
      autorizacionEmpleado: ['', Validators.required]
    });
  }

  submit() {    
    if(this.empleadoConAutrizacion()){
      this.finalizarProceso();
    }else{
      this.snack.open("El código de empleado no es correcto. Por favor validarlo y volver a intentarlo.", "ERROR", { duration: 4000 });         
    }
  }

  finalizarProceso(){
    this.marcaDTO.nombre = this.itemForm.controls.nombre.value;
    this.marcaDTO.descripcion = this.itemForm.controls.descripcion.value;        
    this.marcaDTO.codigoResponsable = this.itemForm.controls.autorizacionEmpleado.value;        
    if(this.esEditar){
      this.marcasService.update(this.token.access_token, this.marcaDTO.idMarca, this.marcaDTO).subscribe(
        res => {
          this.marca = res;
          this.dialogRef.close(this.marca);         
        },
        err => {
          this.snack.open(err.message, "ERROR", { duration: 4000 });
        }
      );
    }else{
      this.marcasService.newRow(this.token.access_token, this.marcaDTO).subscribe(
        res => {
          this.marca = res;
          this.dialogRef.close(this.marca);         
        },
        err => {
          this.snack.open(err.message, "ERROR", { duration: 4000 });
        }
      );
    }
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
        console.log(this.listaEmpleados);
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 4000 });
      }
    );
  }
}
