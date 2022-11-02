import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KardexDto } from 'app/interfaces/dto/kardex-dto';
import { Kardex } from 'app/interfaces/kardex';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KardexService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_KARDEX;

  constructor(
    private http: HttpClient
  ) { }

  getAll(idProducto: string): Observable<Kardex[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<Kardex[]>(`${this.BASE_URL}/${this.entity}/${idProducto}`,{headers: heads});
  }

  getOne(idProducto: string, idKardex: number): Observable<Kardex>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<Kardex>(`${this.BASE_URL}/${this.entity}/${idProducto}/${idKardex}`,{headers: heads});
  }

  newRow(kardexDTO: KardexDto): Observable<Kardex>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.post<Kardex>(`${this.BASE_URL}/${this.entity}`, kardexDTO,{headers: heads});
  }

  update(idKardex: number, kardexDTO: KardexDto): Observable<Kardex>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.put<Kardex>(`${this.BASE_URL}/${this.entity}/${idKardex}`, kardexDTO,{headers: heads});
  }

  delete(idKardex: number){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${idKardex}`,{headers: heads});
  }

}
