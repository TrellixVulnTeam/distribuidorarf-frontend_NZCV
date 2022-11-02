import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionType } from '@swimlane/ngx-datatable';
import { Persona } from 'app/interfaces/persona';
import { Token } from 'app/interfaces/token';
import { PersonaService } from 'app/services/persona.service';
import { UserApiService } from 'app/services/user-api.service';

@Component({
  selector: 'app-buscar-cliente',
  templateUrl: './buscar-cliente.component.html',
  styleUrls: ['./buscar-cliente.component.scss']
})
export class BuscarClienteComponent implements OnInit {

  public itemForm: FormGroup;
  columns: any[] = [{prop: 'identificacion'}, {prop: 'nombre', name:'Nombre'}, {prop: 'apellidos', name:'Apellidos'}];
  rows: Persona[] = [];
  temp: Persona[] = [];
  personaSeleccionada: Persona;
  SelectionType = SelectionType;
  selected = [];

  token: Token ={
    access_token: null
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BuscarClienteComponent>,
    private fb: FormBuilder,
    private tokenService: UserApiService,
    private personaSErvice: PersonaService
  ) { }

  ngOnInit(): void {
    this.buildItemForm();
    if(this.data.items.length > 0){
      this.rows = this.temp = this.data.items;
      this.tokenService.login().subscribe(
        res => {
          this.token = res;
        },
        err => {
          console.log(err);
        }
      );
    }else{
      this.tokenService.login().subscribe(
        res => {
          this.token = res;        
          this.personaSErvice.getAll().subscribe(
            res => {
              this.rows = this.temp = res;
            },
            err => {
              console.log(err);
            }         
          );
        },
        err => {
          console.log(err);        
        }
      );
    }
  }

  buildItemForm(){
    this.itemForm = this.fb.group({
      codigo: ['']
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    var columns = Object.keys(this.temp[0]);
    // Removes last "$$index" from "column"
    columns.splice(columns.length - 1);

    if (!columns.length)
      return;

    const rows = this.temp.filter(function(d) {
      for (let i = 0; i <= columns.length; i++) {
        let column = columns[i];
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });

    this.rows = rows;
  }

  onSelect(event) {           
    this.personaSeleccionada = event.selected[0];
  }

  submit(){
    this.dialogRef.close(this.personaSeleccionada);
  }

}
