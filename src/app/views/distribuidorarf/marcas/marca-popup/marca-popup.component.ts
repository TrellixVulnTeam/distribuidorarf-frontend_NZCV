import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MarcaDto } from 'app/interfaces/dto/marca-dto';
import { Marca } from 'app/interfaces/marca';
import { Token } from 'app/interfaces/token';
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

  marcaDTO: MarcaDto = {
    descripcion: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    idMarca: null,
    nombre: null
  }

  marca: Marca = {
    descripcion: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    idMarca: null,
    nombre: null
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
    private marcasService: MarcasService
  ) { }

  ngOnInit(): void {
    this.buildItemForm(this.data.payload);  
    this.userApiService.login().subscribe(
      res => {
        this.token = res;               
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
    });
  }

  submit() {
    this.marcaDTO.nombre = this.itemForm.controls.nombre.value;
    this.marcaDTO.descripcion = this.itemForm.controls.descripcion.value;        
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

}
