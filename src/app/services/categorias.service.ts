import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categoria } from 'app/interfaces/categoria';
import { CategoriaDto } from 'app/interfaces/dto/categoria-dto';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  BASE_URL: string = environment.BASE_URL;
  entity: string = environment.SERVICE_CATEGORIAS;

  constructor(
    private http: HttpClient
  ) { }

  getAll(token: string): Observable<Categoria[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<Categoria[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(token: string, idCategoria: number): Observable<Categoria>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<Categoria>(`${this.BASE_URL}/${this.entity}/${idCategoria}`,{headers: heads});
  }

  newRow(token: string, categoriaDTO: CategoriaDto): Observable<Categoria>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.post<Categoria>(`${this.BASE_URL}/${this.entity}`, categoriaDTO,{headers: heads});
  }

  update(token: string, idCategoria: number, categoriaDTO: CategoriaDto): Observable<Categoria>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.put<Categoria>(`${this.BASE_URL}/${this.entity}/${idCategoria}`, categoriaDTO,{headers: heads});
  }

  delete(token: string, idCategoria: number){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${idCategoria}`,{headers: heads});
  }

}
