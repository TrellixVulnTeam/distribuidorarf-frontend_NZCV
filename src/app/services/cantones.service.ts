import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Canton } from 'app/interfaces/canton';
import { CantonDto } from 'app/interfaces/dto/canton-dto';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CantonesService {
  BASE_URL: string = environment.BASE_URL;
  entity: string = environment.SERVICE_CANTONES;    

  constructor(
    private http: HttpClient,      
  ) {       
  }        

  getAll(token: string): Observable<Canton[]>{            
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);      
    return this.http.get<Canton[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(codigo: string, codProvincia: string, token: string): Observable<Canton>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);      
    return this.http.get<Canton>(`${this.BASE_URL}/${this.entity}/${codigo}/${codProvincia}`,{headers: heads});
  }

  getCanton(idCanton: number, token: string): Observable<Canton>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);      
    return this.http.get<Canton>(`${this.BASE_URL}/${this.entity}/${idCanton}`,{headers: heads});
  }

  newRow(cantonDTO: CantonDto, token: string): Observable<Canton>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);      
    return this.http.post<Canton>(`${this.BASE_URL}/${this.entity}`, cantonDTO, {headers: heads});
  }

  update(codigo: string, cantonDTO: CantonDto, token: string): Observable<Canton>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);      
    return this.http.put<Canton>(`${this.BASE_URL}/${this.entity}/${codigo}`, cantonDTO,{headers: heads});
  }

  delete(codigo: string, codProvincia: string, token: string){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);      
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${codigo}/${codProvincia}`,{headers: heads});
  }
}
