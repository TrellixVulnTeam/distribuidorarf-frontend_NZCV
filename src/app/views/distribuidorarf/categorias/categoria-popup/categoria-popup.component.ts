import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Categoria } from 'app/interfaces/categoria';
import { CategoriaDto } from 'app/interfaces/dto/categoria-dto';
import { ErrorBk } from 'app/interfaces/error-bk';
import { Token } from 'app/interfaces/token';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { StringManager } from 'app/managers/string-manager';
import { CategoriasService } from 'app/services/categorias.service';
import { FuncionesService } from 'app/services/funciones.service';
import { UserApiService } from 'app/services/user-api.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-categoria-popup',
  templateUrl: './categoria-popup.component.html',
  styleUrls: ['./categoria-popup.component.scss']
})
export class CategoriaPopupComponent implements OnInit {

  strings = StringManager;
  public itemForm: FormGroup;
  esEditar: boolean = false;
  categorias: Categoria[] = [];
  listaEmpleados: any[] = [];

  error: ErrorBk = {
    statusCode: null,
    message: null
  };

  categoriaDTO: CategoriaDto = {
    descripcion: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    idCategoria: null,
    idCategoriaPadre: null,
    nombre: null,
    codigoResponsable: null
  }

  categoria: Categoria = {
    descripcion: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    idCategoria: null,
    idCategoriaPadre: null,
    nombre: null,
    categorias: null,
    codigoResponsable: null
  }

  token: Token = {
    access_token: ``
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CategoriaPopupComponent>,
    private fb: FormBuilder,
    private userApiService: UserApiService,
    private snack: MatSnackBar,
    private categoriasService: CategoriasService,
    private funcionesService: FuncionesService,
    private loader: AppLoaderService,
  ) { }

  ngOnInit(): void {    
    this.loader.open();
    this.buildItemForm(this.data.payload);  
    this.cargarEmpleados();
    this.cargarCategorias();
    if(this.data.payload.idCategoria != '' && this.data.payload.idCategoria != null){      
      this.categoriaDTO.idCategoria = this.data.payload.idCategoria;
      this.esEditar = true;
    }        
  }

  cargarCategorias(){    
    this.categoriasService.getAll().subscribe(
      res => {
        this.categorias = res;
        this.loader.close();
      },
      err => {
        this.error = err.error;
        if(this.error.statusCode == 401){
          this.userApiService.login().subscribe(
            res => {
                this.token = res;
                LocalStorageManger.setToken(this.token.access_token);
                this.cargarCategorias();                                
            },
            err => {
              this.loader.close();
              this.snack.open(err.message, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });
            }
          );              
        }else{
          this.loader.close();
          this.snack.open(err.message, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });
        }
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
        this.error = err.error;
        if(this.error.statusCode == 401){
          this.userApiService.login().subscribe(
            res => {
                this.token = res;
                LocalStorageManger.setToken(this.token.access_token);
                this.cargarEmpleados();                                
            },
            err => {
              this.loader.close();
              this.snack.open(err.message, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });
            }
          );              
        }else{
          this.loader.close();
          this.snack.open(err.message, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });
        }
      }
    );
  }

  submit() {
    if(this.empleadoConAutrizacion()){
      this.categoriaDTO.nombre = this.itemForm.controls.nombre.value;
      this.categoriaDTO.descripcion = this.itemForm.controls.descripcion.value;        
      this.categoriaDTO.codigoResponsable = this.itemForm.controls.autorizacionEmpleado.value;
      if(this.categoriaDTO.idCategoriaPadre == -1){
        this.categoriaDTO.idCategoriaPadre = null;
      }
      console.log(this.categoriaDTO.idCategoriaPadre);
      if(this.esEditar){
        this.categoriasService.update(this.categoriaDTO.idCategoria, this.categoriaDTO).subscribe(
          res => {
            this.categoria = res;
            this.dialogRef.close(this.categoria);         
          },
          err => {
            this.snack.open(err.message, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });
          }
        );
      }else{
        this.categoriasService.newRow(this.categoriaDTO).subscribe(
          res => {
            this.categoria = res;
            this.dialogRef.close(this.categoria);         
          },
          err => {
            this.snack.open(err.message, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });
          }
        );
      }
    }else{
      this.snack.open(this.strings.error_codigo_empleado, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });         
    }  
  }

}
