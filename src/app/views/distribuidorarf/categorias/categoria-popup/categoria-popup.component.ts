import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Categoria } from 'app/interfaces/categoria';
import { CategoriaDto } from 'app/interfaces/dto/categoria-dto';
import { Token } from 'app/interfaces/token';
import { CategoriasService } from 'app/services/categorias.service';
import { UserApiService } from 'app/services/user-api.service';

@Component({
  selector: 'app-categoria-popup',
  templateUrl: './categoria-popup.component.html',
  styleUrls: ['./categoria-popup.component.scss']
})
export class CategoriaPopupComponent implements OnInit {

  public itemForm: FormGroup;
  esEditar: boolean = false;
  categorias: Categoria[] = [];

  categoriaDTO: CategoriaDto = {
    descripcion: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    idCategoria: null,
    idCategoriaPadre: null,
    nombre: null
  }

  categoria: Categoria = {
    descripcion: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    idCategoria: null,
    idCategoriaPadre: null,
    nombre: null,
    categorias: null
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
    private categoriasService: CategoriasService
  ) { }

  ngOnInit(): void {
    this.buildItemForm(this.data.payload);  
    this.userApiService.login().subscribe(
      res => {
        this.token = res;       
        this.cargarCategorias();
        if(this.data.payload.idCategoria != '' && this.data.payload.idCategoria != null){      
          this.categoriaDTO.idCategoria = this.data.payload.idCategoria;
          this.esEditar = true;
        }                 
      },
      err => {
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

  buildItemForm(item) {
    this.itemForm = this.fb.group({            
      nombre: [item.nombre || '', Validators.required],
      descripcion: [item.descripcion || ''],      
    });
  }

  submit() {
    this.categoriaDTO.nombre = this.itemForm.controls.nombre.value;
    this.categoriaDTO.descripcion = this.itemForm.controls.descripcion.value;        
    if(this.categoriaDTO.idCategoriaPadre == -1){
      this.categoriaDTO.idCategoriaPadre = null;
    }
    if(this.esEditar){
      this.categoriasService.update(this.token.access_token, this.categoriaDTO.idCategoria, this.categoriaDTO).subscribe(
        res => {
          this.categoria = res;
          this.dialogRef.close(this.categoria);         
        },
        err => {
          this.snack.open(err.message, "ERROR", { duration: 4000 });
        }
      );
    }else{
      this.categoriasService.newRow(this.token.access_token, this.categoriaDTO).subscribe(
        res => {
          this.categoria = res;
          this.dialogRef.close(this.categoria);         
        },
        err => {
          this.snack.open(err.message, "ERROR", { duration: 4000 });
        }
      );
    }
  }

}