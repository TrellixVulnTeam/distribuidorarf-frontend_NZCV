import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PrecioProductoDto } from 'app/interfaces/dto/precio-producto-dto';
import { PrecioProducto } from 'app/interfaces/precio-producto';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreciosProductosService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_PRECIOS_PRODUCTO;

  constructor(private http: HttpClient) { }

  getAll(): Observable<PrecioProducto[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<PrecioProducto[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(idPrecioProducto: number): Observable<PrecioProducto>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<PrecioProducto>(`${this.BASE_URL}/${this.entity}/${idPrecioProducto}`,{headers: heads});
  }

  newRow(precioProductoDTO: PrecioProductoDto): Observable<PrecioProducto>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.post<PrecioProducto>(`${this.BASE_URL}/${this.entity}`, precioProductoDTO,{headers: heads});
  }

  update(idPrecioProducto: number, precioProductoDTO: PrecioProductoDto): Observable<PrecioProducto>{
    console.log(precioProductoDTO);
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.put<PrecioProducto>(`${this.BASE_URL}/${this.entity}/${idPrecioProducto}`, precioProductoDTO,{headers: heads});
  }

  delete(idPrecioProducto: number){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${idPrecioProducto}`,{headers: heads});
  }
}
