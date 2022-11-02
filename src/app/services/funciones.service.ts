import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CodigosProducto } from 'app/interfaces/interfaces-funciones/codigos-producto';
import { Persona } from 'app/interfaces/persona';
import { LocalStorageManger } from 'app/managers/local-storage-manger';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = this.services.SERVICE_FUNCIONES;    

  constructor(
    private http: HttpClient,      
  ){}        

  validaClienteExiste(identifiacion: string): Observable<number>{            
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
    return this.http.get<number>(`${this.BASE_URL}/${this.entity}/clienteExiste/${identifiacion}`,{headers: heads});
  }

  validaProveedorExiste(nombre: string): Observable<number>{            
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
    return this.http.get<number>(`${this.BASE_URL}/${this.entity}/proveedorExiste/${nombre}`,{headers: heads});
  }

  obtieneCodigosProducto(codigoExterno: string): Observable<CodigosProducto[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
    return this.http.get<CodigosProducto[]>(`${this.BASE_URL}/${this.entity}/obtieneCodigosProducto/${codigoExterno}`,{headers: heads});
  }

  obtenerEmpleados(): Observable<Persona[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
    return this.http.get<Persona[]>(`${this.BASE_URL}/${this.entity}/obtenerEmpleados`,{headers: heads});
  }

  exportarExcel(codigoLote: number): Observable<any>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
    return this.http.get<Persona[]>(`${this.BASE_URL}/${this.entity}/loteExportar/${codigoLote}`,{headers: heads});
  }

  buscarClientes(valor: string): Observable<Persona[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
    return this.http.get<Persona[]>(`${this.BASE_URL}/${this.entity}/buscarClientes/${valor}`,{headers: heads});
  }

  listaProductosBusquedaFactura(precio: string): Observable<any>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + LocalStorageManger.getToken());      
    return this.http.get<any>(`${this.BASE_URL}/${this.entity}/listaProductosBusquedaFactura/${precio}`,{headers: heads});
  }
}