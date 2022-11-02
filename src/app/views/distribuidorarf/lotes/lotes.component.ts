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
import { ErrorBk } from 'app/interfaces/error-bk';
import { ServiceManager } from 'app/managers/service-manager';
import { StringManager } from 'app/managers/string-manager';
import { environment } from 'environments/environment';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';

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

  error: ErrorBk = {
    statusCode: null,
    message: null
  };
  intentos = 0;
  serviceManager = ServiceManager;
  strings = StringManager;

  constructor(    
    public lotesService: LotesService,
    private tokenService: UserApiService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private procedimientosdbService: ProcedimientosDbService,
    private funcionesService: FuncionesService,
    private procedimientosDBService: ProcedimientosDbService,
    private detalleLoteServices: DetallesLoteService,
    private loader: AppLoaderService,
  ) { }

  ngOnInit(): void {
    this.cargarLotes();
    this.cargarEmpleados();      
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
    this.lotesService.getAll().subscribe(
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
                  this.cargarLotes();
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

  drop(event: CdkDragDrop<string[]>, fase: number) {    
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);      
    } else {
      if(fase == 1){        
        this.actualizarFase(event.previousContainer.data[event.previousIndex]['codigoLote'],1, event);        
      }else if(fase == 2){      
        this.actualizarFase(event.previousContainer.data[event.previousIndex]['codigoLote'],2, event);       
      }else if(fase == 3){
        this.detalleLoteServices.getAll(event.previousContainer.data[event.previousIndex]['codigoLote']).subscribe(
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
              this.snack.open("No se puede actualizar la fase, falta completar productos: Todas las compras deben estar asiganadas a tallas y colores de los productos.", "Cerrar", { duration: 8000 });
            }
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
                      this.drop(event, fase);
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
              this.procedimientosDBService.finalizaLote(cLote, result.value).subscribe(
                res => {                  
                  this.actualizarFase(event2.previousContainer.data[event.previousIndex]['codigoLote'],4, event2);      
                  this.snack.open('Detalles Actualizados.', "ÉXITO!!", { duration: 8000 });
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
                            this.drop(event, fase);
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

    this.procedimientosdbService.actualizaFase(fase, codigoLote).subscribe(
      res => {
        this.moverItem(event);
        this.snack.open("Fase actualizada!!!", "Cerrar", { duration: 8000 });                            
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
                  this.actualizarFase(codigoLote, fase, event);
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
          this.procedimientosDBService.borrarLote(codigoLote).subscribe(
            res => {
              let respuesta: string = res;
              this.cargarLotes();
              this.snack.open("Lote eliminado con éxito.", "ÉXITO!!!", { duration: 8000 }); 
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
                        this.borrarLote(codigoLote);
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
    this.funcionesService.obtenerEmpleados().subscribe(
      res => {
        this.listaEmpleados = res;
      },
      err => {
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

  fileName= '';
  listaDetalleLote: DetalleLote[] = [];
  exporttoexcel(codigoLote: number): void
  {    
    this.listaDetalleLote = [];
    this.fileName = '';
    this.funcionesService.exportarExcel(codigoLote).subscribe(
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
                  this.exporttoexcel(codigoLote);
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