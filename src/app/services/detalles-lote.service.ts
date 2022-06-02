import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalleLote } from 'app/interfaces/detalle-lote';
import { DetalleLoteDto } from 'app/interfaces/dto/detalle-lote-dto';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetallesLoteService {

  BASE_URL: string = environment.BASE_URL;
  entity: string = environment.SERVICE_DETALLE_LOTES;

  constructor(
    private http: HttpClient
  ) { }

  getAll(token: string, lote?: number): Observable<DetalleLote[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<DetalleLote[]>(`${this.BASE_URL}/${this.entity}/${lote}`,{headers: heads});
  }

  getOne(token: string, lote: number, producto: string): Observable<DetalleLote>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<DetalleLote>(`${this.BASE_URL}/${this.entity}/${lote}/${producto}`,{headers: heads});
  }

  newRow(token: string, dLoteDTO: DetalleLoteDto): Observable<DetalleLote>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.post<DetalleLote>(`${this.BASE_URL}/${this.entity}`, dLoteDTO,{headers: heads});
  }

  update(token: string, lote: number, producto: string, dLoteDTO: DetalleLoteDto): Observable<DetalleLote>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.put<DetalleLote>(`${this.BASE_URL}/${this.entity}/${lote}/${producto}`, dLoteDTO,{headers: heads});
  }

  delete(token: string, lote: number, producto: string){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${lote}/${producto}`,{headers: heads});
  }

  
}


