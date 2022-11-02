import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Canton } from 'app/interfaces/canton';
import { CantonDto } from 'app/interfaces/dto/canton-dto';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CantonesService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_CANTONES;    

  constructor(
    private http: HttpClient,      
  ) {       
  }        

  getAll(): Observable<Canton[]>{            
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
    return this.http.get<Canton[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(codigo: string, codProvincia: string): Observable<Canton>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
    return this.http.get<Canton>(`${this.BASE_URL}/${this.entity}/${codigo}/${codProvincia}`,{headers: heads});
  }

  getCanton(idCanton: number): Observable<Canton>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
    return this.http.get<Canton>(`${this.BASE_URL}/${this.entity}/${idCanton}`,{headers: heads});
  }

  newRow(cantonDTO: CantonDto): Observable<Canton>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
    return this.http.post<Canton>(`${this.BASE_URL}/${this.entity}`, cantonDTO, {headers: heads});
  }

  update(codigo: string, cantonDTO: CantonDto): Observable<Canton>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
    return this.http.put<Canton>(`${this.BASE_URL}/${this.entity}/${codigo}`, cantonDTO,{headers: heads});
  }

  delete(codigo: string, codProvincia: string){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${codigo}/${codProvincia}`,{headers: heads});
  }
}
