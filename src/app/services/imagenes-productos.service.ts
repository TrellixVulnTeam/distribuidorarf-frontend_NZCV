import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImagenProductoDto } from 'app/interfaces/dto/imagen-producto-dto';
import { ImagenProducto } from 'app/interfaces/imagen-producto';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenesProductosService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_IMAGENES_PRODUCTO;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ImagenProducto[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<ImagenProducto[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(idImagenProducto: number): Observable<ImagenProducto>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<ImagenProducto>(`${this.BASE_URL}/${this.entity}/${idImagenProducto}`,{headers: heads});
  }

  newRow(imagenProductoDTO: ImagenProductoDto): Observable<ImagenProducto>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.post<ImagenProducto>(`${this.BASE_URL}/${this.entity}`, imagenProductoDTO,{headers: heads});
  }

  update(idImagenProducto: number, imagenProductoDTO: ImagenProductoDto): Observable<ImagenProducto>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.put<ImagenProducto>(`${this.BASE_URL}/${this.entity}/${idImagenProducto}`, imagenProductoDTO,{headers: heads});
  }

  delete(idImagenProducto: number){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${idImagenProducto}`,{headers: heads});
  }
}
