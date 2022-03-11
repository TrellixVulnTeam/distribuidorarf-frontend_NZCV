import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MarcaDto } from 'app/interfaces/dto/marca-dto';
import { Marca } from 'app/interfaces/marca';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarcasService {

  BASE_URL: string = environment.BASE_URL;
  entity: string = environment.SERVICE_MARCAS;

  constructor(
    private http: HttpClient
  ) { }

  getAll(token: string): Observable<Marca[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<Marca[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(token: string, idCategoria: number): Observable<Marca>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<Marca>(`${this.BASE_URL}/${this.entity}/${idCategoria}`,{headers: heads});
  }

  newRow(token: string, marcaDTO: MarcaDto): Observable<Marca>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.post<Marca>(`${this.BASE_URL}/${this.entity}`, marcaDTO,{headers: heads});
  }

  update(token: string, idMarca: number, marcaDTO: MarcaDto): Observable<Marca>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.put<Marca>(`${this.BASE_URL}/${this.entity}/${idMarca}`, marcaDTO,{headers: heads});
  }

  delete(token: string, idMarca: number){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${idMarca}`,{headers: heads});
  }
}
