import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FacturaDto } from 'app/interfaces/dto/factura-dto';
import { Factura } from 'app/interfaces/factura';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_FACTURAS;

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Factura[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());        
    return this.http.get<Factura[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getInvoicesList(): Observable<any[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());        
    return this.http.get<any[]>(`${this.BASE_URL}/${this.entity}/getInvoicesList`,{headers: heads});
  }

  getOne(id: string): Observable<Factura>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<Factura>(`${this.BASE_URL}/${this.entity}/${id}`,{headers: heads});
  }

  createInvoice(invoice: any): Observable<string>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.post<string>(`${this.BASE_URL}/${this.entity}/createInvoice`, invoice, {headers: heads});
  }

  newRow(newDTO: FacturaDto): Observable<Factura>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.post<Factura>(`${this.BASE_URL}/${this.entity}`, newDTO,{headers: heads});
  }

  update(id: string, updateDTO: FacturaDto): Observable<Factura>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.put<Factura>(`${this.BASE_URL}/${this.entity}/${id}`, updateDTO,{headers: heads});
  }

  delete(id: string){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${id}`,{headers: heads});
  }
}
