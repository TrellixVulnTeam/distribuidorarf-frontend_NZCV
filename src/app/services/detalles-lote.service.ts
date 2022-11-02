import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalleLote } from 'app/interfaces/detalle-lote';
import { DetalleLoteDto } from 'app/interfaces/dto/detalle-lote-dto';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetallesLoteService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_DETALLE_LOTES;

  constructor(
    private http: HttpClient
  ) { }

  getAll(lote?: number): Observable<DetalleLote[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<DetalleLote[]>(`${this.BASE_URL}/${this.entity}/${lote}`,{headers: heads});
  }

  getOne(lote: number, producto: string): Observable<DetalleLote>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<DetalleLote>(`${this.BASE_URL}/${this.entity}/${lote}/${producto}`,{headers: heads});
  }

  newRow(dLoteDTO: DetalleLoteDto): Observable<DetalleLote>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.post<DetalleLote>(`${this.BASE_URL}/${this.entity}`, dLoteDTO,{headers: heads});
  }

  update(lote: number, producto: string, dLoteDTO: DetalleLoteDto): Observable<DetalleLote>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.put<DetalleLote>(`${this.BASE_URL}/${this.entity}/${lote}/${producto}`, dLoteDTO,{headers: heads});
  }

  delete(lote: number, producto: string){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${lote}/${producto}`,{headers: heads});
  }

  
}


