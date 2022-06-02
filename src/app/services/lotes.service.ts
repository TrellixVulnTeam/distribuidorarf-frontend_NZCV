import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoteDto } from 'app/interfaces/dto/lote-dto';
import { Lote } from 'app/interfaces/lote';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LotesService {

  BASE_URL: string = environment.BASE_URL;
  entity: string = environment.SERVICE_LOTES;


  constructor(
    private http: HttpClient
  ) { }

  getAll(token: string): Observable<Lote[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<Lote[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(token: string, codigoLote: number): Observable<Lote>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<Lote>(`${this.BASE_URL}/${this.entity}/${codigoLote}`,{headers: heads});
  }

  newRow(token: string, loteDTO: LoteDto): Observable<Lote>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.post<Lote>(`${this.BASE_URL}/${this.entity}`, loteDTO,{headers: heads});
  }

  update(token: string, codigoLote: number, loteDTO: LoteDto): Observable<Lote>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.put<Lote>(`${this.BASE_URL}/${this.entity}/${codigoLote}`, loteDTO,{headers: heads});
  }

  delete(token: string, codigoLote: number){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${codigoLote}`,{headers: heads});
  }
}
