import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Token } from 'app/interfaces/token';
import { UserApi } from 'app/interfaces/user-api';
import { ServiceManager } from 'app/managers/service-manager';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  services = ServiceManager;
  BASE_URL: string = environment.BASE_URL;
  entity: string = environment.SERVICE_LOGIN_API;

  user: UserApi = {
    username: environment.API_USER,
    password: environment.API_PASS
  }

  constructor(private http: HttpClient) { }    

  login(): Observable<Token>{    
    return this.http.post<Token>(`${this.BASE_URL}/${this.entity}`, this.user);
  }
}
