import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorBk } from 'app/interfaces/error-bk';
import { Token } from 'app/interfaces/token';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { StringManager } from 'app/managers/string-manager';
import { FacturasService } from 'app/services/facturas.service';
import { UserApiService } from 'app/services/user-api.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-listado-facturas',
  templateUrl: './listado-facturas.component.html',
  styleUrls: ['./listado-facturas.component.scss']
})
export class ListadoFacturasComponent implements OnInit {

  items: InvoiceResume[] = [];
  public temp = [];
  token: Token;

  strings = StringManager;
  intentos = 0;
  serviceManager = ServiceManager;
  error: ErrorBk = {
    statusCode: null,
    message: null
  };


  constructor(
    private loader: AppLoaderService,
    private tokenService: UserApiService,
    private snack: MatSnackBar,
    private facturasService: FacturasService
  ) { }

  ngOnInit(): void {
    this.loader.open();    
    this.loadInvoices();
  }

  loadInvoices() {
    this.facturasService.getInvoicesList().subscribe(
      res => {
        this.items = this.temp = res;        
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
                  this.loadInvoices();
              },
              err => {
                this.loader.close(); 
                this.snack.open(err.message, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });
              }
            );              
          }else{
            this.loader.close();
            this.snack.open(this.strings.factura_error_lista + err.message, this.strings.cerrar_title, { duration: environment.TIEMPO_NOTIFICACION });
          }
        }               
      }
    );
  }

  updateFilter(event) {  
    const val = event.target.value.toLowerCase();    
    var columns = Object.keys(this.temp[0]);    
    // Removes last "$$index" from "column"
    //columns.splice(columns.length - 1);    

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

    this.items = rows;        
  }

}

export interface InvoiceResume {
  idfactura: number;
  fechaemision: Date,
  fechavencimiento: Date,
  codigoresponsable: string,
  monto: number,
  montopendiente: number,
  montopagado: number,
  pagada: boolean,
  cantidadproducto: number,
  fechaemsisionproforma: Date,
  cliente: string
}
