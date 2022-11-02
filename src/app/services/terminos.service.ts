import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Termino } from 'app/interfaces/termino';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TerminosService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_TERMINOS;    

  constructor(
    private http: HttpClient,      
  ) {       
  }        

  getAll(): Observable<Termino[]>{            
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
    return this.http.get<Termino[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }  
}
