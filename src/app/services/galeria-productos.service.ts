import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GproductoDto } from 'app/interfaces/dto/gproducto-dto';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { Product } from 'app/shared/models/product.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { retry, takeUntil, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GaleriaProductosService {
  
  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_GALERIA_PRODUCTO;

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Observable<GproductoDto[]>>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return await this.http.get<GproductoDto[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getAll2(): Observable<GproductoDto[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<GproductoDto[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }
}
