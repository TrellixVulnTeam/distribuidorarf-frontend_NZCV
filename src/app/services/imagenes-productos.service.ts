import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImagenProductoDto } from 'app/interfaces/dto/imagen-producto-dto';
import { ImagenProducto } from 'app/interfaces/imagen-producto';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenesProductosService {

  BASE_URL: string = environment.BASE_URL;
  entity: string = environment.SERVICE_IMAGENES_PRODUCTO;

  constructor(private http: HttpClient) { }

  getAll(token: string): Observable<ImagenProducto[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<ImagenProducto[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(token: string, idImagenProducto: number): Observable<ImagenProducto>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<ImagenProducto>(`${this.BASE_URL}/${this.entity}/${idImagenProducto}`,{headers: heads});
  }

  newRow(token: string, imagenProductoDTO: ImagenProductoDto): Observable<ImagenProducto>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.post<ImagenProducto>(`${this.BASE_URL}/${this.entity}`, imagenProductoDTO,{headers: heads});
  }

  update(token: string, idImagenProducto: number, imagenProductoDTO: ImagenProductoDto): Observable<ImagenProducto>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.put<ImagenProducto>(`${this.BASE_URL}/${this.entity}/${idImagenProducto}`, imagenProductoDTO,{headers: heads});
  }

  delete(token: string, idImagenProducto: number){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${idImagenProducto}`,{headers: heads});
  }
}
