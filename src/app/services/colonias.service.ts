import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColoniasService {
  constructor(private http: HttpClient) {}

  buscarPorCodigoPostal(cp: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/colonias/${cp}`);
  }
}
