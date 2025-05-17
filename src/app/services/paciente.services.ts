import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Rol, Usuario} from '../pacientes/Paciente.model';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  crearPacienteCompleto(data: {
    paciente: any,
    usuario: any,
    domicilio: any
  }) {
    return this.http.post<any>(`${this.apiUrl}/pacientes/crear`, data).toPromise();
  }

  crearDomicilio(domicilio: {
    calle: string;
    numero: string;
    interior: string | undefined;
    id_cp: number | undefined;
    id_colonia: number | undefined;
    id_municipio: number | undefined;
    id_entidad: number | undefined;
    id_cliente: any
  }) {
    return this.http.post<any>(`${this.apiUrl}/domicilios/crear`, domicilio).toPromise();
  }

  actualizarUsuario(usuario: { idusuario: number; nombreusuario: any; email: any; password: any }) {
    return this.http.put<any>(`${this.apiUrl}/usuarios/actualizar/${usuario.idusuario}`, usuario).toPromise();
  }
  obtenerTodos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pacientes`);
  }

  buscarPaciente(term: string) {
    return this.http.get<any[]>(`${this.apiUrl}/pacientes/paciente/${term}`);
  }

  obtenerColoniasPorCP(codigoPostal: string) {
    //return this.http.get<any[]>(`${this.apiUrl}/colonias/${codigoPostal}`, {
    return this.http.get<any[]>(`${this.apiUrl}/pacientes/colonias/${codigoPostal}`, {
      withCredentials: true
    });
  }
  getRolesActivos(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${environment.apiBaseUrl}/roles`);
  }

}
