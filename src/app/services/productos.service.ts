import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductoDto } from 'app/interfaces/dto/producto-dto';
import { Producto } from 'app/interfaces/producto';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_PRODUCTOS;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Producto[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());        
    return this.http.get<Producto[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(idProducto: string): Observable<Producto>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<Producto>(`${this.BASE_URL}/${this.entity}/${idProducto}`,{headers: heads});
  }

  newRow(productoDTO: ProductoDto): Observable<Producto>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    console.log(productoDTO);
    return this.http.post<Producto>(`${this.BASE_URL}/${this.entity}`, productoDTO,{headers: heads});
  }

  update(idProducto: string, productoDTO: ProductoDto): Observable<Producto>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.put<Producto>(`${this.BASE_URL}/${this.entity}/${idProducto}`, productoDTO,{headers: heads});
  }

  delete(idProducto: string){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${idProducto}`,{headers: heads});
  }
}
