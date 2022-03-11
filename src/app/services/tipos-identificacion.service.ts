import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoIdentificacionDto } from 'app/interfaces/dto/tipo-identificacion-dto';
import { TipoIdentificacion } from 'app/interfaces/tipo-identificacion';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiposIdentificacionService {

  BASE_URL: string = environment.BASE_URL;
    entity: string = environment.SERVICE_TIPOS_IDENTIFICACION;        

    constructor(
      private http: HttpClient
    ) {                               
    }

    getAll(token: string): Observable<TipoIdentificacion[]>{      
      let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);      
      return this.http.get<TipoIdentificacion[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
    }
    
    getAllByProvincia(idTipoIdentificacion: number, token: string): Observable<TipoIdentificacion>{
      let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);      
      return this.http.get<TipoIdentificacion>(`${this.BASE_URL}/${this.entity}/${idTipoIdentificacion}`,{headers: heads});
    }

    getOne(idTipoIdentificacion: number, token: string): Observable<TipoIdentificacion>{
      let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);      
        return this.http.get<TipoIdentificacion>(`${this.BASE_URL}/${this.entity}/${idTipoIdentificacion}`,{headers: heads});
    }
  
    newRow(tipoIdentificacionDTO: TipoIdentificacionDto, token: string): Observable<TipoIdentificacion>{
      let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);      
      return this.http.post<TipoIdentificacion>(`${this.BASE_URL}/${this.entity}`, tipoIdentificacionDTO,{headers: heads});
    }
  
    update(idTipoIdentificacion: number, tipoIdentificacionDTO: TipoIdentificacionDto, token: string): Observable<TipoIdentificacion>{
      let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);      
      return this.http.put<TipoIdentificacion>(`${this.BASE_URL}/${this.entity}/${idTipoIdentificacion}`, tipoIdentificacionDTO,{headers: heads});
    }
  
    delete(idTipoIdentificacion: number, token: string){
      let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);      
      return this.http.delete(`${this.BASE_URL}/${this.entity}/${idTipoIdentificacion}`,{headers: heads});
    }
}
