import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalleProforma } from 'app/interfaces/detalle-proforma';
import { DetalleProformaDto } from 'app/interfaces/dto/detalle-proforma-dto';
import { DetalleProformaInsertarDto } from 'app/interfaces/dto/detalle-proforma-insertar-dto';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetallesProformasService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_DETALLES_PROFORMAS;

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<DetalleProforma[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());        
    return this.http.get<DetalleProforma[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getByPreInvoice(id: string): Observable<DetalleProforma[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());        
    return this.http.get<DetalleProforma[]>(`${this.BASE_URL}/${this.entity}/getByPreInvoice/${id}`,{headers: heads});
  }

  getOne(id: string): Observable<DetalleProforma>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<DetalleProforma>(`${this.BASE_URL}/${this.entity}/${id}`,{headers: heads});
  }

  newRow(newDTO: DetalleProformaDto): Observable<DetalleProforma>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.post<DetalleProforma>(`${this.BASE_URL}/${this.entity}`, newDTO,{headers: heads});
  }

  update(id: string, updateDTO: DetalleProformaDto): Observable<DetalleProforma>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.put<DetalleProforma>(`${this.BASE_URL}/${this.entity}/${id}`, updateDTO,{headers: heads});
  }

  delete(id: string){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${id}`,{headers: heads});
  }

  insertFullPreInvoice(newDTO: DetalleProformaInsertarDto): Observable<string>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.post<string>(`${this.BASE_URL}/${this.entity}/insertFullPreInvoice`, newDTO,{headers: heads});
  }

  updateFullPreInvoice(newDTO: DetalleProformaInsertarDto): Observable<string>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.post<string>(`${this.BASE_URL}/${this.entity}/updateFullPreInvoice`, newDTO,{headers: heads});
  }

  deleteFullPreInvoice(newDTO: DetalleProformaInsertarDto): Observable<string>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.post<string>(`${this.BASE_URL}/${this.entity}/deleteFullPreInvoice`, newDTO,{headers: heads});
  }

}
