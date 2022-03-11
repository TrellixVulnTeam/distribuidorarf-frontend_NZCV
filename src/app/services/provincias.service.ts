import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Provincia } from 'app/interfaces/provincia';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProvinciasService {

  BASE_URL: string = environment.BASE_URL;
  entity: string = environment.SERVICE_PROVINCIAS;

  constructor(
    private http: HttpClient
  ) { }

  getAll(token: string): Observable<Provincia[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<Provincia[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(cod: string, token: string): Observable<Provincia>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    console.log(token);
    return this.http.get<Provincia>(`${this.BASE_URL}/${this.entity}/${cod}`,{headers: heads});
  }

  delete(cod: string, token: string){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${cod}`,{headers: heads});
  }
}
