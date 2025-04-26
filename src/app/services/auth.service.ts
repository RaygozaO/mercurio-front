import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  login(email: string, pass: string, captchaAnswer: string, captchaExpected: string): Observable<{ token: string; role: number }> {
    const payload = { email, pass, captchaAnswer, captchaExpected };
    return this.http.post<{ token: string; role: number }>(`${this.apiUrl}${environment.endpoints.login}`, payload);
  }

  register(data: { nombreusuario: string; email: string; pass: string; id_rol?: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }
}
