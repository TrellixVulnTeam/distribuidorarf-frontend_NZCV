import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoIdentificacionDto } from 'app/interfaces/dto/tipo-identificacion-dto';
import { TipoIdentificacion } from 'app/interfaces/tipo-identificacion';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiposIdentificacionService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_TIPOS_IDENTIFICACION;        

    constructor(
      private http: HttpClient
    ) {                               
    }

    getAll(): Observable<TipoIdentificacion[]>{      
      let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
      return this.http.get<TipoIdentificacion[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
    }
    
    getAllByProvincia(idTipoIdentificacion: number): Observable<TipoIdentificacion>{
      let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
      return this.http.get<TipoIdentificacion>(`${this.BASE_URL}/${this.entity}/${idTipoIdentificacion}`,{headers: heads});
    }

    getOne(idTipoIdentificacion: number): Observable<TipoIdentificacion>{
      let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
        return this.http.get<TipoIdentificacion>(`${this.BASE_URL}/${this.entity}/${idTipoIdentificacion}`,{headers: heads});
    }
  
    newRow(tipoIdentificacionDTO: TipoIdentificacionDto): Observable<TipoIdentificacion>{
      let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
      return this.http.post<TipoIdentificacion>(`${this.BASE_URL}/${this.entity}`, tipoIdentificacionDTO,{headers: heads});
    }
  
    update(idTipoIdentificacion: number, tipoIdentificacionDTO: TipoIdentificacionDto): Observable<TipoIdentificacion>{
      let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
      return this.http.put<TipoIdentificacion>(`${this.BASE_URL}/${this.entity}/${idTipoIdentificacion}`, tipoIdentificacionDTO,{headers: heads});
    }
  
    delete(idTipoIdentificacion: number){
      let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
      return this.http.delete(`${this.BASE_URL}/${this.entity}/${idTipoIdentificacion}`,{headers: heads});
    }
}
