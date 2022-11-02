import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcedimientosDbService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_PROCEDIMIENTOS_DB;    

  constructor(
    private http: HttpClient,      
  ){}        

  actualizaFase(fase: number, codigoLote: number): Observable<string>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
    return this.http.get<string>(`${this.BASE_URL}/${this.entity}/actualizaFase/${fase}/${codigoLote}`,{headers: heads});
  }

  actualizaCantidadAsiganaDetalleLote(codigoLote: number): Observable<string>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
    return this.http.get<string>(`${this.BASE_URL}/${this.entity}/actualizaCantidadAsiganaDetalleLote/${codigoLote}`,{headers: heads});
  }

  actualizaCostoLote(codigoLote: number): Observable<string>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
    return this.http.get<string>(`${this.BASE_URL}/${this.entity}//${codigoLote}`,{headers: heads});
  }

  borrarLote(codigoLote: number): Observable<string>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
    return this.http.get<string>(`${this.BASE_URL}/${this.entity}/borrarLote/${codigoLote}`,{headers: heads});
  }

  finalizaLote(codigoLote: number, responsable: string): Observable<string>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
    return this.http.get<string>(`${this.BASE_URL}/${this.entity}/finalizaLote/${codigoLote}/${responsable}`,{headers: heads});
  }
}
