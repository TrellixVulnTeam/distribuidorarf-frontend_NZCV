import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PersonaDto } from 'app/interfaces/dto/persona-dto';
import { ErrorBk } from 'app/interfaces/error-bk';
import { Persona } from 'app/interfaces/persona';
import { Token } from 'app/interfaces/token';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { StringManager } from 'app/managers/string-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { UserApiService } from './user-api.service';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_PERSONAS;    

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Persona[]>{
    console.log('token: '+LocalStorageManger.getToken());
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<Persona[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }


  getOneByAuthorizationCode(authorizationCode: string): Observable<Persona>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<Persona>(`${this.BASE_URL}/${this.entity}/getOneByAuthorizationCode/${authorizationCode}`,{headers: heads});
  }

  getOne(identificacion: string): Observable<Persona>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<Persona>(`${this.BASE_URL}/${this.entity}/${identificacion}`,{headers: heads});
  }

  getPersonUser(usuario: string, contrasena: string, esUsuario: boolean){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<Persona>(`${this.BASE_URL}/${this.entity}/${esUsuario}/${usuario}/${contrasena}`,{headers: heads});
  }

  newRow(personaDTO: PersonaDto): Observable<Persona>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.post<Persona>(`${this.BASE_URL}/${this.entity}`, personaDTO,{headers: heads});
  }

  update(identificacion: string, personaDTO: PersonaDto): Observable<Persona>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.put<Persona>(`${this.BASE_URL}/${this.entity}/${identificacion}`, personaDTO,{headers: heads});
  }

  delete(identificacion: string){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${identificacion}`,{headers: heads});
  }  
}
