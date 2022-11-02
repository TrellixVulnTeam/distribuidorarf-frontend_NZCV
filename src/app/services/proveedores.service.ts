import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProveedorDto } from 'app/interfaces/dto/proveedor-dto';
import { Proveedor } from 'app/interfaces/proveedor';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_PROVEEDORES;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Proveedor[]>{    
    let heads = new HttpHeaders().set('Authorization', `bearer ${LocalStorageManger.getToken()}`);             
    return this.http.get<Proveedor[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(identificacion: number): Observable<Proveedor>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<Proveedor>(`${this.BASE_URL}/${this.entity}/${identificacion}`,{headers: heads});
  }

  newRow(proveedorDTO: ProveedorDto): Observable<Proveedor>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.post<Proveedor>(`${this.BASE_URL}/${this.entity}`, proveedorDTO,{headers: heads});
  }

  update(identificacion: number, proveedorDTO: ProveedorDto): Observable<Proveedor>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.put<Proveedor>(`${this.BASE_URL}/${this.entity}/${identificacion}`, proveedorDTO,{headers: heads});
  }

  delete(identificacion: number){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${identificacion}`,{headers: heads});
  }  
}