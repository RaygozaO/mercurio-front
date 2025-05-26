import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = `${environment.apiBaseUrl}${environment.endpoints.login}`;
  private registerUrl = `${environment.apiBaseUrl}${environment.endpoints.register}`;
  private authUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string, captchaAnswer: string, expected: string) {
    return this.http.post<{
      token: string;
      role: number;
      idusuario: number;
      idcliente?: number;
    }>(this.loginUrl, {
      email,
      clave_log: password,
      captchaAnswer,
      expected
    });
  }

  register(data: { nombreusuario: string; email: string; pass: string; id_rol?: number }): Observable<any> {
    return this.http.post(this.registerUrl, data);
  }
  obtenerUsuarioPorId(id: number): Observable<any> {
    return this.http.get(`${this.authUrl}/usuario/${id}`);
  }
}

