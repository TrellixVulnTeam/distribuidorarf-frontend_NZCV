import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalleLote } from 'app/interfaces/detalle-lote';
import { DetalleProducto } from 'app/interfaces/detalle-producto';
import { DetalleProductoLote } from 'app/interfaces/detalle-producto-lote';
import { DetalleProductoLoteDto } from 'app/interfaces/dto/detalle-producto-lote-dto';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetallesProductosLoteService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_DETALLES_PRODUCTOS_LOTE;

  constructor(
    private http: HttpClient  
  ) { }

  getAll(): Observable<DetalleProductoLote[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<DetalleProductoLote[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(pDetalleProducto: string, pDetalleLote: string): Observable<DetalleProductoLote>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<DetalleProductoLote>(`${this.BASE_URL}/${this.entity}/${pDetalleProducto}/${pDetalleLote}`,{headers: heads});
  }

  newRow(dplDTO: DetalleProductoLoteDto): Observable<DetalleProductoLote>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.post<DetalleProductoLote>(`${this.BASE_URL}/${this.entity}`, dplDTO,{headers: heads});
  }

  update(dLoteDTO: DetalleProductoLoteDto): Observable<DetalleProductoLote>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.put<DetalleProductoLote>(`${this.BASE_URL}/${this.entity}`, dLoteDTO,{headers: heads});
  }

  delete(pDetalleProducto: string, pDetalleLote: string){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${pDetalleProducto}/${pDetalleLote}`,{headers: heads});
  }

}
