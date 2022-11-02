import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoteDto } from 'app/interfaces/dto/lote-dto';
import { Lote } from 'app/interfaces/lote';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LotesService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_LOTES;


  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Lote[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<Lote[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(codigoLote: number): Observable<Lote>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<Lote>(`${this.BASE_URL}/${this.entity}/${codigoLote}`,{headers: heads});
  }

  newRow(loteDTO: LoteDto): Observable<Lote>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.post<Lote>(`${this.BASE_URL}/${this.entity}`, loteDTO,{headers: heads});
  }

  update(codigoLote: number, loteDTO: LoteDto): Observable<Lote>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.put<Lote>(`${this.BASE_URL}/${this.entity}/${codigoLote}`, loteDTO,{headers: heads});
  }

  delete(codigoLote: number){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${codigoLote}`,{headers: heads});
  }
}
