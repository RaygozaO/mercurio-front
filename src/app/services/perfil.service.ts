import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = `${environment.apiBaseUrl}/perfil`;

  constructor(private http: HttpClient) {}

  obtenerPerfil(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  actualizarPerfil(data: any): Observable<any> {
    return this.http.put(this.apiUrl, data);
  }
}
