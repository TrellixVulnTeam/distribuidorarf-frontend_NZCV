import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalleLote } from 'app/interfaces/detalle-lote';
import { DetalleProducto } from 'app/interfaces/detalle-producto';
import { DetalleProductoLote } from 'app/interfaces/detalle-producto-lote';
import { DetalleProductoLoteDto } from 'app/interfaces/dto/detalle-producto-lote-dto';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetallesProductosLoteService {

  BASE_URL: string = environment.BASE_URL;
  entity: string = environment.SERVICE_DETALLES_PRODUCTOS_LOTE;

  constructor(
    private http: HttpClient  
  ) { }

  getAll(token: string): Observable<DetalleProductoLote[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<DetalleProductoLote[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(token: string, pDetalleProducto: string, pDetalleLote: string): Observable<DetalleProductoLote>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<DetalleProductoLote>(`${this.BASE_URL}/${this.entity}/${pDetalleProducto}/${pDetalleLote}`,{headers: heads});
  }

  newRow(token: string, dplDTO: DetalleProductoLoteDto): Observable<DetalleProductoLote>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.post<DetalleProductoLote>(`${this.BASE_URL}/${this.entity}`, dplDTO,{headers: heads});
  }

  update(token: string, dLoteDTO: DetalleProductoLoteDto): Observable<DetalleProductoLote>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.put<DetalleProductoLote>(`${this.BASE_URL}/${this.entity}`, dLoteDTO,{headers: heads});
  }

  delete(token: string, pDetalleProducto: string, pDetalleLote: string){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${pDetalleProducto}/${pDetalleLote}`,{headers: heads});
  }

}
