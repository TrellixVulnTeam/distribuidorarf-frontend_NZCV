import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DetalleProductoLote } from 'app/interfaces/detalle-producto-lote';
import { LoteDto } from 'app/interfaces/dto/lote-dto';
import { Lote } from 'app/interfaces/lote';
import { Token } from 'app/interfaces/token';
import { LotesService } from 'app/services/lotes.service';
import { ProcedimientosDbService } from 'app/services/procedimientos-db.service';
import { UserApiService } from 'app/services/user-api.service';
import { TodoItem } from 'app/shared/models/todo.model';
import { AsignacionDetalleProductosComponent } from './asignacion-detalle-productos/asignacion-detalle-productos.component';
import Swal from 'sweetalert2';
import { Persona } from 'app/interfaces/persona';
import { FuncionesService } from 'app/services/funciones.service';
import { DetallesLoteService } from 'app/services/detalles-lote.service';
import { DetalleLote } from 'app/interfaces/detalle-lote';
import * as XLSX from 'xlsx';
import { number } from 'ngx-custom-validators/src/app/number/validator';

@Component({
  selector: 'app-lotes',
  templateUrl: './lotes.component.html',
  styleUrls: ['./lotes.component.scss']
})
export class LotesComponent implements OnInit {

  token: Token = {
    access_token: ``
  }

  listaEmpleados: Persona[] = [];
  
  loteActualizaDTO: LoteDto = {
    cantidadTotal: null,
    codigoLote: null,
    codigoResponsable: null,
    costoTotal: null,
    descripcion: null,    
    fase: null,
    fecha: null,
    moneda: null,
    tipoCambio: null,
  }

  constructor(    
    public lotesService: LotesService,
    private userApiService: UserApiService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private procedimientosdbService: ProcedimientosDbService,
    private funcionesService: FuncionesService,
    private procedimientosDBService: ProcedimientosDbService,
    private detalleLoteServices: DetallesLoteService
  ) { }

  ngOnInit(): void {
    this.userApiService.login().subscribe(
      res => {
          this.token = res;
          this.cargarLotes();
          this.cargarEmpleados();
      },
      err => {
          this.snack.open(err.message, "ERROR", { duration: 8000 });
      }
    ); 
  }

  lotes: Lote[] = [];
  todo: Lote[] = [];
  done: Lote[] = [];
  aduanas: Lote[] = [];
  finished: Lote[] = [];
  detallesLote: DetalleLote[] = [];

  cargarLotes(){
    this.todo = [];
    this.done = [];
    this.aduanas = [];
    this.finished = [];
    this.lotesService.getAll(this.token.access_token).subscribe(
      res => {
        this.lotes = res;
        this.lotes.forEach(element => {
          if(element.fase == 1){            
            this.todo.push(element);
          }else if(element.fase == 2){
            this.done.push(element);
          }else if(element.fase == 3){
            this.aduanas.push(element);
          }else if(element.fase == 4){
            this.finished.push(element);
          }
        });
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 8000 });
      }
    );
  }

  drop(event: CdkDragDrop<string[]>, fase: number) {    
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);      
    } else {
      if(fase == 1){        
        this.actualizarFase(event.previousContainer.data[event.previousIndex]['codigoLote'],1, event);        
      }else if(fase == 2){      
        this.actualizarFase(event.previousContainer.data[event.previousIndex]['codigoLote'],2, event);       
      }else if(fase == 3){
        this.detalleLoteServices.getAll(this.token.access_token, event.previousContainer.data[event.previousIndex]['codigoLote']).subscribe(
          res => {
            this.detallesLote = res;
            let completado = true;
            this.detallesLote.forEach(element => {
              if(element.cantidad != element.cantidadAsignada){
                completado = false;
              }
            });
            if(completado){          
              this.actualizarFase(event.previousContainer.data[event.previousIndex]['codigoLote'],3, event);
            }else{
              this.snack.open("No se puede actualizar la fase, falta completar productos: Todas las compras deben estar asiganadas a talles y colores de los productos.", "Cerrar", { duration: 8000 });
            }
          },
          err => {
            this.snack.open(err.message, "ERROR", { duration: 8000 });
          }
        );            
      }else if(fase == 4){          
        let cLote = event.previousContainer.data[event.previousIndex]['codigoLote'];
        let event2 = event;
        Swal.fire({
          title: 'Finalizar Lote!!',
          text: "Desea finalizar el lote definitivamente?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Finalizar!!',
          cancelButtonText: 'Cancelar',
          backdrop: true,
          input: 'password',
          inputAttributes: {
            autocapitalize: 'off'
          },
          allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
          if (result.isConfirmed) {
            if(this.empleadoConAutrizacion(result.value) != true){
              this.snack.open("Código de autorización inválido.", "ERROR!!", { duration: 8000 }); 
            }else{
              alert(cLote);
              this.procedimientosDBService.finalizaLote(this.token.access_token, cLote, result.value).subscribe(
                res => {                  
                  this.actualizarFase(event2.previousContainer.data[event.previousIndex]['codigoLote'],4, event2);      
                  this.snack.open('Detalles Actualizados.', "ÉXITO!!", { duration: 8000 });
                },
                err => {
                  this.snack.open(err.message, "ERROR", { duration: 8000 });
                }
              );
            }
          }
        }) 
      }      
    }
  }

  moverItem(event: CdkDragDrop<string[]>) {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
  }

  actualizarFase(codigoLote, fase, event: CdkDragDrop<string[]>){

    this.procedimientosdbService.actualizaFase(this.token.access_token, fase, codigoLote).subscribe(
      res => {
        this.moverItem(event);
        this.snack.open("Fase actualizada!!!", "Cerrar", { duration: 8000 });                            
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 8000 });
      }
    );    
  }

  showDetailProductsForm(data: any = {}){
    let title = 'Asignación de Detalles de Productos';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AsignacionDetalleProductosComponent, {            
      maxWidth: '80vw',
      maxHeight: '90vh',
      disableClose: true,
      data: { title: title, payload: data }
    })
    dialogRef.afterClosed()
      .subscribe(res => {  
        if(res !== false){        
          this.cargarLotes();    
          this.snack.open(res, "Cerrar", { duration: 8000 });
        }        
    })
  }

  borrarLote(codigoLote){
    Swal.fire({
      title: 'Eliminar Lote!!',
      text: "Desea eliminar el lote definitivamente?",
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
          this.snack.open("Código de autorización inválido.", "ERROR!!", { duration: 8000 }); 
        }else{
          this.procedimientosDBService.borrarLote(this.token.access_token, codigoLote).subscribe(
            res => {
              let respuesta: string = res;
              this.cargarLotes();
              this.snack.open("Lote eliminado con éxito.", "ÉXITO!!!", { duration: 8000 }); 
            },
            err => {
              this.snack.open(err.message, "ERROR", { duration: 8000 }); 
            }
          );
        }
      }
    })    
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
    this.funcionesService.obtenerEmpleados(this.token.access_token).subscribe(
      res => {
        this.listaEmpleados = res;
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 8000 });
      }
    );
  }

  fileName= '';
  listaDetalleLote: DetalleLote[] = [];
  exporttoexcel(codigoLote: number): void
  {    
    this.listaDetalleLote = [];
    this.fileName = '';
    this.funcionesService.exportarExcel(this.token.access_token, codigoLote).subscribe(
      res => {
        this.listaDetalleLote = res;
        console.log(this.listaDetalleLote);
        Swal.fire({
          title: 'Exportar Lote!!',
          text: "Ingrese el nombre para el archivo de exportación",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Exportar!',
          cancelButtonText: 'Cancelar',
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
          if (result.isConfirmed) {
            this.fileName = result.value + '.xlsx';
            /* pass here the table id */
            let element = document.getElementById('excel-table');
            const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
        
            /* generate workbook and add the worksheet */
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        
            /* save to file */  
            XLSX.writeFile(wb, this.fileName);            
          }
        })                    
      },
      err => {
        this.snack.open(err.message, "ERROR", { duration: 8000 });
      }
    );

  }

  printLabels(codigoLote: number){
    alert('Aqui vamos a imprimir las etiquetas');
  }

}

interface loteExportar{
  descripcion: string,
  composicion: string,
  estilo: string,
  marca: string,
  cantidad: number,
  precioUnitario: number,
  precioTotal: number
}