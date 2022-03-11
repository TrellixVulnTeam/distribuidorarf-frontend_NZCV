import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PersonaDto } from 'app/interfaces/dto/persona-dto';
import { Persona } from 'app/interfaces/persona';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  BASE_URL: string = environment.BASE_URL;
  entity: string = environment.SERVICE_PERSONAS;

  constructor(private http: HttpClient) { }

  getAll(token: string): Observable<Persona[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<Persona[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(token: string, identificacion: string): Observable<Persona>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<Persona>(`${this.BASE_URL}/${this.entity}/${identificacion}`,{headers: heads});
  }

  getPersonUser(usuario: string, contrasena: string, token: string, esUsuario: boolean){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<Persona>(`${this.BASE_URL}/${this.entity}/${esUsuario}/${usuario}/${contrasena}`,{headers: heads});
  }

  newRow(token: string, personaDTO: PersonaDto): Observable<Persona>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.post<Persona>(`${this.BASE_URL}/${this.entity}`, personaDTO,{headers: heads});
  }

  update(token: string, identificacion: string, personaDTO: PersonaDto): Observable<Persona>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.put<Persona>(`${this.BASE_URL}/${this.entity}/${identificacion}`, personaDTO,{headers: heads});
  }

  delete(token: string, identificacion: string){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${identificacion}`,{headers: heads});
  }  
}
