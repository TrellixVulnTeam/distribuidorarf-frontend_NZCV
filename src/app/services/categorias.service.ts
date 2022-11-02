import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categoria } from 'app/interfaces/categoria';
import { CategoriaDto } from 'app/interfaces/dto/categoria-dto';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_CATEGORIAS;

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Categoria[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<Categoria[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(idCategoria: number): Observable<Categoria>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<Categoria>(`${this.BASE_URL}/${this.entity}/${idCategoria}`,{headers: heads});
  }

  newRow(categoriaDTO: CategoriaDto): Observable<Categoria>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.post<Categoria>(`${this.BASE_URL}/${this.entity}`, categoriaDTO,{headers: heads});
  }

  update(idCategoria: number, categoriaDTO: CategoriaDto): Observable<Categoria>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.put<Categoria>(`${this.BASE_URL}/${this.entity}/${idCategoria}`, categoriaDTO,{headers: heads});
  }

  delete(idCategoria: number){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${idCategoria}`,{headers: heads});
  }

}
