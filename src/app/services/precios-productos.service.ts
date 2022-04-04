import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PrecioProductoDto } from 'app/interfaces/dto/precio-producto-dto';
import { PrecioProducto } from 'app/interfaces/precio-producto';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreciosProductosService {

  BASE_URL: string = environment.BASE_URL;
  entity: string = environment.SERVICE_PRECIOS_PRODUCTO;

  constructor(private http: HttpClient) { }

  getAll(token: string): Observable<PrecioProducto[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<PrecioProducto[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(token: string, idPrecioProducto: number): Observable<PrecioProducto>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<PrecioProducto>(`${this.BASE_URL}/${this.entity}/${idPrecioProducto}`,{headers: heads});
  }

  newRow(token: string, precioProductoDTO: PrecioProductoDto): Observable<PrecioProducto>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.post<PrecioProducto>(`${this.BASE_URL}/${this.entity}`, precioProductoDTO,{headers: heads});
  }

  update(token: string, idPrecioProducto: number, precioProductoDTO: PrecioProductoDto): Observable<PrecioProducto>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.put<PrecioProducto>(`${this.BASE_URL}/${this.entity}/${idPrecioProducto}`, precioProductoDTO,{headers: heads});
  }

  delete(token: string, idPrecioProducto: number){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${idPrecioProducto}`,{headers: heads});
  }
}
