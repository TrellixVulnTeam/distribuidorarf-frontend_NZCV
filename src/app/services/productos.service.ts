import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductoDto } from 'app/interfaces/dto/producto-dto';
import { Producto } from 'app/interfaces/producto';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  BASE_URL: string = environment.BASE_URL;
  entity: string = environment.SERVICE_PRODUCTOS;

  constructor(private http: HttpClient) { }

  getAll(token: string): Observable<Producto[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);        
    return this.http.get<Producto[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(token: string, idProducto: string): Observable<Producto>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<Producto>(`${this.BASE_URL}/${this.entity}/${idProducto}`,{headers: heads});
  }

  newRow(token: string, productoDTO: ProductoDto): Observable<Producto>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    console.log(productoDTO);
    return this.http.post<Producto>(`${this.BASE_URL}/${this.entity}`, productoDTO,{headers: heads});
  }

  update(token: string, idProducto: string, productoDTO: ProductoDto): Observable<Producto>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.put<Producto>(`${this.BASE_URL}/${this.entity}/${idProducto}`, productoDTO,{headers: heads});
  }

  delete(token: string, idProducto: string){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${idProducto}`,{headers: heads});
  }
}
