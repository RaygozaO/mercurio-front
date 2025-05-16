import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecetaService {
  private apiUrl = `${environment.apiBaseUrl}/recetas`;

  constructor(private http: HttpClient) {}

  // Crear una receta con sus productos
  guardarReceta(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  // Obtener recetas de un paciente
  obtenerRecetasPorPaciente(idpaciente: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/paciente/${idpaciente}`);
  }

  // Obtener detalle de una receta por id
  obtenerDetalleReceta(idreceta: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/detalle/${idreceta}`);
  }
}
