import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParametroDto } from 'app/interfaces/dto/parametro-dto';
import { Parametro } from 'app/interfaces/parametro';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_PARAMETROS;

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Parametro[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());        
    return this.http.get<Parametro[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(id: number): Observable<Parametro>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<Parametro>(`${this.BASE_URL}/${this.entity}/${id}`,{headers: heads});
  }

  newRow(newDTO: ParametroDto): Observable<Parametro>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.post<Parametro>(`${this.BASE_URL}/${this.entity}`, newDTO,{headers: heads});
  }  

  update(id: number, updateDTO: ParametroDto): Observable<Parametro>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.put<Parametro>(`${this.BASE_URL}/${this.entity}/${id}`, updateDTO,{headers: heads});
  }

  delete(id: number){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${id}`,{headers: heads});
  }
}
