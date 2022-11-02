import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MarcaDto } from 'app/interfaces/dto/marca-dto';
import { Marca } from 'app/interfaces/marca';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarcasService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_MARCAS;

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Marca[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<Marca[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(idCategoria: number): Observable<Marca>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<Marca>(`${this.BASE_URL}/${this.entity}/${idCategoria}`,{headers: heads});
  }

  newRow(marcaDTO: MarcaDto): Observable<Marca>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.post<Marca>(`${this.BASE_URL}/${this.entity}`, marcaDTO,{headers: heads});
  }

  update(idMarca: number, marcaDTO: MarcaDto): Observable<Marca>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.put<Marca>(`${this.BASE_URL}/${this.entity}/${idMarca}`, marcaDTO,{headers: heads});
  }

  delete(idMarca: number){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${idMarca}`,{headers: heads});
  }
}
