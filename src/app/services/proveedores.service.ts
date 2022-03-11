import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductoDto } from 'app/interfaces/dto/producto-dto';
import { ProveedorDto } from 'app/interfaces/dto/proveedor-dto';
import { Proveedor } from 'app/interfaces/proveedor';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  BASE_URL: string = environment.BASE_URL;
  entity: string = environment.SERVICE_PROVEEDORES;

  constructor(private http: HttpClient) { }

  getAll(token: string): Observable<Proveedor[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<Proveedor[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(token: string, identificacion: string): Observable<Proveedor>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<Proveedor>(`${this.BASE_URL}/${this.entity}/${identificacion}`,{headers: heads});
  }

  newRow(token: string, proveedorDTO: ProveedorDto): Observable<Proveedor>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.post<Proveedor>(`${this.BASE_URL}/${this.entity}`, proveedorDTO,{headers: heads});
  }

  update(token: string, identificacion: string, proveedorDTO: ProveedorDto): Observable<Proveedor>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.put<Proveedor>(`${this.BASE_URL}/${this.entity}/${identificacion}`, proveedorDTO,{headers: heads});
  }

  delete(token: string, identificacion: string){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${identificacion}`,{headers: heads});
  }  
}
