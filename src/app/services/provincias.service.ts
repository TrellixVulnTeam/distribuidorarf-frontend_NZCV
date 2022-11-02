import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Provincia } from 'app/interfaces/provincia';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProvinciasService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_PROVINCIAS;

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Provincia[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<Provincia[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(cod: string): Observable<Provincia>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<Provincia>(`${this.BASE_URL}/${this.entity}/${cod}`,{headers: heads});
  }

  delete(cod: string){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${cod}`,{headers: heads});
  }
}
