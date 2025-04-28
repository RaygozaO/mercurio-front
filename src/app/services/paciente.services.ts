import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../pacientes/Paciente.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  crearCliente(cliente: {
    nombrecliente: any;
    apellidopaterno: any;
    apellidomaterno: any;
    telefono: any;
    id_usuario: number
  }) {
    return this.http.post<any>(`${this.apiUrl}/pacientes/crear`, cliente).toPromise();
  }
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

  buscarUsuario(term: string) {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios/buscar?term=${term}`).toPromise();
  }

  obtenerColoniasPorCP(codigoPostal: string) {
    return this.http.get<any[]>(`${this.apiUrl}/colonias/${codigoPostal}`, {
      withCredentials: true
    });
  }

}
