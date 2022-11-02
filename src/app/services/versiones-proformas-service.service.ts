import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VersionProformaDto } from 'app/interfaces/dto/version-proforma-dto';
import { VersionProforma } from 'app/interfaces/version-proforma';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VersionesProformasServiceService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_VERSIONES_PROFORMAS;

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<VersionProforma[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());        
    return this.http.get<VersionProforma[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getOne(id: string): Observable<VersionProforma>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<VersionProforma>(`${this.BASE_URL}/${this.entity}/${id}`,{headers: heads});
  }

  getAllByPreinvoice(id: number): Observable<VersionProformaTarjeta[]>{
    console.log(`${this.BASE_URL}/${this.entity}/getAllByPreinvoice/${id}`);
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.get<VersionProformaTarjeta[]>(`${this.BASE_URL}/${this.entity}/getAllByPreinvoice/lista/${id}`,{headers: heads});    
  } 

  newRow(newDTO: VersionProformaDto): Observable<VersionProforma>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.post<VersionProforma>(`${this.BASE_URL}/${this.entity}`, newDTO,{headers: heads});
  }  

  update(id: number, updateDTO: VersionProformaDto): Observable<VersionProforma>{
    let heads = new HttpHeaders().set('Authorization',  'bearer ' + LocalStorageManger.getToken());
    return this.http.put<VersionProforma>(`${this.BASE_URL}/${this.entity}/${id}`, updateDTO,{headers: heads});
  }

  delete(id: number){
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());
    return this.http.delete(`${this.BASE_URL}/${this.entity}/${id}`,{headers: heads});
  }

}

interface VersionProformaTarjeta{
  version: number;
  detalleproforma: number;
  cantidadanterior: number;
  cantidadactual: number;
  accion: string;
  codigoresponsable: string;
  totallinea: number;
  preciounitario: number;
  detalleproducto: string;
  nombre: string;  
  fechacreacion: Date;
  fechaultimamodificacion: Date;
}