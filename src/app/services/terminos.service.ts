import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Termino } from 'app/interfaces/termino';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TerminosService {
  BASE_URL: string = environment.BASE_URL;
  entity: string = environment.SERVICE_TERMINOS;    

  constructor(
    private http: HttpClient,      
  ) {       
  }        

  getAll(token: string): Observable<Termino[]>{            
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);      
    return this.http.get<Termino[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }  
}
