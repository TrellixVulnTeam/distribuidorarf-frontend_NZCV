import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoPersona } from 'app/interfaces/tipo-persona';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiposPersonaService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_TIPOS_PERSONA;    

  constructor(
    private http: HttpClient,      
  ) {       
  }        

  getAll(): Observable<TipoPersona[]>{            
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
    return this.http.get<TipoPersona[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }
}
