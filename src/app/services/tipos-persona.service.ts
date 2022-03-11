import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoPersona } from 'app/interfaces/tipo-persona';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiposPersonaService {
  BASE_URL: string = environment.BASE_URL;
  entity: string = environment.SERVICE_TIPOS_PERSONA;    

  constructor(
    private http: HttpClient,      
  ) {       
  }        

  getAll(token: string): Observable<TipoPersona[]>{            
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);      
    return this.http.get<TipoPersona[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }
}
