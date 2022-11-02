import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorBk } from 'app/interfaces/error-bk';
import { Parametro } from 'app/interfaces/parametro';
import { Persona } from 'app/interfaces/persona';
import { Proforma } from 'app/interfaces/proforma';
import { Token } from 'app/interfaces/token';
import { VersionProforma } from 'app/interfaces/version-proforma';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { StringManager } from 'app/managers/string-manager';
import { ParametrosService } from 'app/services/parametros.service';
import { PersonaService } from 'app/services/persona.service';
import { ProformasService } from 'app/services/proformas.service';
import { UserApiService } from 'app/services/user-api.service';
import { VersionesProformasServiceService } from 'app/services/versiones-proformas-service.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-versiones-proforma',
  templateUrl: './versiones-proforma.component.html',
  styleUrls: ['./versiones-proforma.component.scss']
})
export class VersionesProformaComponent implements OnInit {

  versionesProforma: VersionProformaTarjeta[] = [];
  token: Token;
  list: PreinvoiceVersionsList[] = [];
  proforma: Proforma;
  parametros: Parametro[] = [];
  cuenta1: string;
  cuenta2: string;
  nombreEmpresa: string;
  telefono: string;
  seller: Persona;
  preinvoiceId: number;

  error: ErrorBk = {
    statusCode: null,
    message: null
  };
  intentos = 0;
  serviceManager = ServiceManager;
  strings = StringManager;

  constructor(
    private tokenService: UserApiService,
    private versionesProformasService: VersionesProformasServiceService,
    private proformasService: ProformasService,
    private snack: MatSnackBar,
    private loader: AppLoaderService,
    private route: ActivatedRoute,
    private parametrosService: ParametrosService,
    private personasService: PersonaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loader.open();
    this.loadParameters();
    this.route.queryParams.subscribe(params => {
      if(params.id){            
        this.preinvoiceId = +params.id;
        this.loadPreinvoiceVersions(params.id);
      }else{
        console.log('No hay id');
      }
    });        
  }

  loadSeller(id: string) {
    this.personasService.getOne(id).subscribe(
      res => {
        this.seller = res;
      }
    );
  }

  loadParameters() {
    this.parametrosService.getAll().subscribe(
      res => {
        this.parametros = res;
        this.cuenta1 = this.parametros.find(item => item.nombre === 'cuenta1').valor;
        this.cuenta2 = this.parametros.find(item => item.nombre === 'cuenta2').valor;
        this.nombreEmpresa = this.parametros.find(item => item.nombre === 'nombreEmpresa').valor;
        this.telefono = this.parametros.find(item => item.nombre === 'telefono').valor;
      },
      err => {
        this.reintento(err, nombresMetodos.loadParameters);
      }
    );
  }

  goPreinvoice(){
    const url = '/proformas/add?id='+this.preinvoiceId;
    this.router.navigateByUrl(url);    
  }

  loadPreinvoiceVersions(id: number) {

    this.proformasService.getOne(id).subscribe(
      res => {
        this.proforma = res;                
        this.loadSeller(this.proforma.vendedor);
        this.versionesProformasService.getAllByPreinvoice(id).subscribe(
          res => {
            this.versionesProforma = res;

            if(this.versionesProforma.length > 1){
              this.versionesProforma.reduce((acc, cur) => {                        
                const index = this.list.findIndex(item => item.version === cur.version);              
                if (index === -1) {                        
                  let f = new Date(cur.fechaultimamodificacion);                            
                  f.setHours(f.getHours() + (f.getTimezoneOffset() / 60) * -1);
                  cur.fechaultimamodificacion = f;
                  this.list.push({
                    version: cur.version,
                    body: [],
                    total: +0,
                    cantidad: +0,
                    fecha: cur.fechaultimamodificacion,
                  });
                }
                return acc;
              });              
            }else{
              let f = new Date(this.versionesProforma[0].fechaultimamodificacion);                            
              f.setHours(f.getHours() + (f.getTimezoneOffset() / 60) * -1);
              this.versionesProforma[0].fechaultimamodificacion = f;
              this.list.push({
                version: this.versionesProforma[0].version,
                body: [],
                total: +0,
                cantidad: +0,
                fecha: this.versionesProforma[0].fechaultimamodificacion,
              });
            }
            console.log(this.versionesProforma);
            this.versionesProforma.forEach(version => {               
              const index = this.list.findIndex(item => item.version === version.version);
              if (index !== -1) {            
                this.list[index].body.push(version);
                this.list[index].total += +version.totallinea;
                this.list[index].cantidad += +version.cantidadactual;
              }
            });
    
            console.log(this.list);
            this.loader.close();        
          },
          err => {
            this.reintento(err, nombresMetodos.loadPreinvoiceVersions, null, null, null, id);
          }
        );
      }      
    );    
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
              if(metodo === nombresMetodos.loadParameters){
                this.loadParameters();
              }else if(metodo === nombresMetodos.loadPreinvoiceVersions){
                this.loadPreinvoiceVersions(id);
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

enum nombresMetodos {  
  loadParameters = 'loadParameters',
  loadPreinvoiceVersions = 'loadPreinvoiceVersions',
}

interface PreinvoiceVersionsList {
  version: number; 
  fecha: Date;
  total: number;
  cantidad: number;
  body: VersionProformaTarjeta[];
}

interface VersionProformaTarjeta{
  version: number;
  detalleproforma: number;
  cantidadanterior: number;
  cantidadactual: number;
  accion: string;
  codigoresponsable: string;
  totallinea: number;
  preciounitario: number;
  detalleproducto: string;
  nombre: string;  
  fechacreacion: Date;
  fechaultimamodificacion: Date;
}