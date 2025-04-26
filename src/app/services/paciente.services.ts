import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Paciente, Usuario, Domicilio } from '../pacientes/Paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  obtenerColoniasPorCP(cp: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pacientes/colonias/${cp}`);
  }

  crearPaciente(paciente: Paciente, usuario: Usuario, domicilio: Domicilio): Observable<any> {
    const payload = { paciente, usuario, domicilio };
    return this.http.post(`${this.apiUrl}/pacientes/crear`, payload);
  }
}
