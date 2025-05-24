import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

export interface Referencia {
  idreferencia?: number;
  idmedico_origen: number;
  idmedico_destino: number;
  idpaciente: number;
  motivo: string;
  fecha_referencia?: string;
  estado?: string;
}

@Injectable({ providedIn: 'root' })
export class ReferenciaService {
  private baseUrl = `${environment.apiBaseUrl}/referencias`;

  constructor(private http: HttpClient) {}

  getDoctores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/medicos`);
  }

  crearReferencia(ref: Referencia): Observable<any> {
    return this.http.post(`${this.baseUrl}/crear`, ref);
  }

  obtenerTodas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/todas`);
  }
  obtenerIdMedicoPorUsuario(idusuario: number): Observable<{ idmedico: number }> {
    return this.http.get<{ idmedico: number }>(`${this.baseUrl}/medico-por-usuario/${idusuario}`);
  }

}
