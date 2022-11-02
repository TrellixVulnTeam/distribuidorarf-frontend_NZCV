import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ErrorBk } from 'app/interfaces/error-bk';
import { Token } from 'app/interfaces/token';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { StringManager } from 'app/managers/string-manager';
import { ProformasService } from 'app/services/proformas.service';
import { UserApiService } from 'app/services/user-api.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-listado-proformas',
  templateUrl: './listado-proformas.component.html',
  styleUrls: ['./listado-proformas.component.scss']
})
export class ListadoProformasComponent implements OnInit {

  items: ProformaItem[] = [];
  public temp = [];
  token: Token;

  error: ErrorBk = {
    statusCode: null,
    message: null
  };
  intentos = 0;
  serviceManager = ServiceManager;
  strings = StringManager;

  constructor(
    private proformaService: ProformasService,
    private loader: AppLoaderService,
    private tokenService: UserApiService,
    private snack: MatSnackBar,
    private route: Router
  ) { }

  ngOnInit(): void {    
    this.cargarProformas(); 
  }

  cargarProformas() {
    this.loader.open();
    this.proformaService.getAllForList().subscribe(
      res => {        
        this.items = this.temp = res;
        this.loader.close();
      },
      err => {
        this.reintento(err, nombresMetodos.cargarProformas);
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

  editPreinvoice(data: any = {}){
    const url = '/proformas/add?id='+data.idproforma;
    this.route.navigateByUrl(url);    
  }

  convertInInvoice(data: any = {}){
    const url = '/proformas/add?id='+data.idproforma+'&convertToInvoice=true';
    this.route.navigateByUrl(url);    
  }

  history(data: any = {}){
    const url = '/proformas/versiones-proforma?id='+data.idproforma;
    this.route.navigateByUrl(url);    
  }

  reintento(err: any, metodo: string, data?: any, isNew?: boolean, url?: string, id?: number){    
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
              if(metodo === nombresMetodos.cargarProformas){
                this.cargarProformas();
              }else{
                this.snack.open(this.strings.error_mgs_metodo_no_encontrado + metodo, this.strings.error_title, { duration: environment.TIEMPO_NOTIFICACION });
              }
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

}

export interface ProformaItem {
  idprofroma: number;
  fechaemision: Date;
  cantidadproductos: number;
  total: number;
  cliente: string;
  estado: string;
}

enum nombresMetodos {  
  cargarProformas = 'cargarProformas'
}
