import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalleProducto } from 'app/interfaces/detalle-producto';
import { DetalleProductoDto } from 'app/interfaces/dto/detalle-producto-dto';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetallesProductosService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_DETALLES_PRODUCTO;

  constructor(private http: HttpClient) { }

  getAll(): Observable<DetalleProducto[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<DetalleProducto[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(idDetalleProducto: string): Observable<DetalleProducto>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<DetalleProducto>(`${this.BASE_URL}/${this.entity}/${idDetalleProducto}`,{headers: heads});
  }

  getProductToInvoice(precio: string, idDetalleProducto: string): Observable<any>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<any>(`${this.BASE_URL}/${this.entity}/getProductToInvoice/${precio}/${idDetalleProducto}`,{headers: heads});
  }

  newRow(detalleProductoDTO: DetalleProductoDto): Observable<DetalleProducto>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    console.log(`${this.BASE_URL}/${this.entity}`);
    return this.http.post<DetalleProducto>(`${this.BASE_URL}/${this.entity}`, detalleProductoDTO,{headers: heads});
  }

  update(idDetalleProducto: string, detalleProductoDTO: DetalleProductoDto): Observable<DetalleProducto>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.put<DetalleProducto>(`${this.BASE_URL}/${this.entity}/${idDetalleProducto}`, detalleProductoDTO,{headers: heads});
  }

  delete(idDetalleProducto: string){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${idDetalleProducto}`,{headers: heads});
  }
}
