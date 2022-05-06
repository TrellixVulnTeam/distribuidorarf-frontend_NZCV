import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalleProducto } from 'app/interfaces/detalle-producto';
import { DetalleProductoDto } from 'app/interfaces/dto/detalle-producto-dto';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetallesProductosService {

  BASE_URL: string = environment.BASE_URL;
  entity: string = environment.SERVICE_DETALLES_PRODUCTO;

  constructor(private http: HttpClient) { }

  getAll(token: string): Observable<DetalleProducto[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<DetalleProducto[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(token: string, idDetalleProducto: string): Observable<DetalleProducto>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<DetalleProducto>(`${this.BASE_URL}/${this.entity}/${idDetalleProducto}`,{headers: heads});
  }

  newRow(token: string, detalleProductoDTO: DetalleProductoDto): Observable<DetalleProducto>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    console.log(`${this.BASE_URL}/${this.entity}`);
    console.log(detalleProductoDTO);
    return this.http.post<DetalleProducto>(`${this.BASE_URL}/${this.entity}`, detalleProductoDTO,{headers: heads});
  }

  update(token: string, idDetalleProducto: string, detalleProductoDTO: DetalleProductoDto): Observable<DetalleProducto>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.put<DetalleProducto>(`${this.BASE_URL}/${this.entity}/${idDetalleProducto}`, detalleProductoDTO,{headers: heads});
  }

  delete(token: string, idDetalleProducto: string){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${idDetalleProducto}`,{headers: heads});
  }
}
