import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GproductoDto } from 'app/interfaces/dto/gproducto-dto';
import { Product } from 'app/shared/models/product.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { retry, takeUntil, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GaleriaProductosService {
     
  BASE_URL: string = environment.BASE_URL;
  entity: string = environment.SERVICE_GALERIA_PRODUCTO;

  constructor(private http: HttpClient) { }

  async getAll(token: string): Promise<Observable<GproductoDto[]>>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return await this.http.get<GproductoDto[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }

  getAll2(token: string): Observable<GproductoDto[]>{
    let heads = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.get<GproductoDto[]>(`${this.BASE_URL}/${this.entity}`,{headers: heads});
  }
}
