import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcedimientosDbService {

  BASE_URL: string = environment.BASE_URL;
  entity: string = environment.SERVICE_PROCEDIMIENTOS_DB;    

  constructor(
    private http: HttpClient,      
  ){}        

  actualizaFase(token: string, fase: number, codigoLote: number): Observable<string>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);      
    return this.http.get<string>(`${this.BASE_URL}/${this.entity}/actualizaFase/${fase}/${codigoLote}`,{headers: heads});
  }

  actualizaCantidadAsiganaDetalleLote(token: string, codigoLote: number): Observable<string>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);      
    return this.http.get<string>(`${this.BASE_URL}/${this.entity}/actualizaCantidadAsiganaDetalleLote/${codigoLote}`,{headers: heads});
  }

  actualizaCostoLote(token: string, codigoLote: number): Observable<string>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);      
    return this.http.get<string>(`${this.BASE_URL}/${this.entity}//${codigoLote}`,{headers: heads});
  }

  borrarLote(token: string, codigoLote: number): Observable<string>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);      
    return this.http.get<string>(`${this.BASE_URL}/${this.entity}/borrarLote/${codigoLote}`,{headers: heads});
  }

  finalizaLote(token: string, codigoLote: number, responsable: string): Observable<string>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);      
    return this.http.get<string>(`${this.BASE_URL}/${this.entity}/finalizaLote/${codigoLote}/${responsable}`,{headers: heads});
  }
}
