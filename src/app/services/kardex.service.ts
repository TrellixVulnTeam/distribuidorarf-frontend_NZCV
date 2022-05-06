import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KardexDto } from 'app/interfaces/dto/kardex-dto';
import { Kardex } from 'app/interfaces/kardex';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KardexService {

  BASE_URL: string = environment.BASE_URL;
  entity: string = environment.SERVICE_KARDEX;

  constructor(
    private http: HttpClient
  ) { }

  getAll(token: string, idProducto: string): Observable<Kardex[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<Kardex[]>(`${this.BASE_URL}/${this.entity}/${idProducto}`,{headers: heads});
  }

  getOne(token: string, idProducto: string, idKardex: number): Observable<Kardex[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<Kardex[]>(`${this.BASE_URL}/${this.entity}/${idProducto}/${idKardex}`,{headers: heads});
  }

  newRow(token: string, kardexDTO: KardexDto): Observable<Kardex>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.post<Kardex>(`${this.BASE_URL}/${this.entity}`, kardexDTO,{headers: heads});
  }

  update(token: string, idKardex: number, kardexDTO: KardexDto): Observable<Kardex>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.put<Kardex>(`${this.BASE_URL}/${this.entity}/${idKardex}`, kardexDTO,{headers: heads});
  }

  delete(token: string, idKardex: number){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${idKardex}`,{headers: heads});
  }

}
