import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CodigosProducto } from 'app/interfaces/interfaces-funciones/codigos-producto';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {
  BASE_URL: string = environment.BASE_URL;
  entity: string = environment.SERVICE_FUNCIONES;    

  constructor(
    private http: HttpClient,      
  ){}        

  validaClienteExiste(token: string, identifiacion: string): Observable<number>{            
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);      
    return this.http.get<number>(`${this.BASE_URL}/${this.entity}/clienteExiste/${identifiacion}`,{headers: heads});
  }

  validaProveedorExiste(token: string, nombre: string): Observable<number>{            
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);      
    return this.http.get<number>(`${this.BASE_URL}/${this.entity}/proveedorExiste/${nombre}`,{headers: heads});
  }

  obtieneCodigosProducto(token: string, codigoExterno: string): Observable<CodigosProducto[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);      
    return this.http.get<CodigosProducto[]>(`${this.BASE_URL}/${this.entity}/obtieneCodigosProducto/${codigoExterno}`,{headers: heads});
  }
}
