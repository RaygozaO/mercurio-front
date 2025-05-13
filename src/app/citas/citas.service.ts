import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CitasService {

  private apiUrl = `${environment.apiBaseUrl}/citas`;
  constructor(private http: HttpClient) { }

  getCitasPorMedico(idmedico: number | string | null) {
    return this.http.get<any[]>(`${this.apiUrl}/medico/${idmedico}`)
  }
  getTodasLasCitas(){
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
  crearCita(cita: any) {
    return this.http.post<any>(this.apiUrl, cita);
  }
  getDoctores() {
    return this.http.get<any[]>(`${this.apiUrl}/medicos`);
  }

}
