import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProformaDto } from 'app/interfaces/dto/proforma-dto';
import { Proforma } from 'app/interfaces/proforma';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProformasService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_PROFORMAS;

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Proforma[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());        
    return this.http.get<Proforma[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getAllForList(): Observable<any[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());        
    return this.http.get<any[]>(`${this.BASE_URL}/${this.entity}/listadoProformas`,{headers: heads});
  }

  getOne(id: number): Observable<Proforma>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<Proforma>(`${this.BASE_URL}/${this.entity}/${id}`,{headers: heads});
  }

  maxVersion(idProforma: number): Observable<number>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<number>(`${this.BASE_URL}/${this.entity}/maxVersion/${idProforma}`,{headers: heads});
  }

  newRow(newDTO: ProformaDto): Observable<Proforma>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.post<Proforma>(`${this.BASE_URL}/${this.entity}`, newDTO,{headers: heads});
  }  

  update(idProforma: number, updateDTO: ProformaDto): Observable<Proforma>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.put<Proforma>(`${this.BASE_URL}/${this.entity}/${idProforma}`, updateDTO,{headers: heads});
  }

  delete(idProforma: number){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${idProforma}`,{headers: heads});
  }
}
