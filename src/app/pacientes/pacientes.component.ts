import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Paciente, Domicilio, Usuario } from './Paciente.model';
import { PacienteService } from '../services/paciente.services';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment'; // 🔥 Nuevo para buscar usuarios

@Component({
  selector: 'app-pacientes',
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.scss'
})
export class PacientesComponent {
  clienteForm: FormGroup;
  paciente: Paciente = {
    idcliente: 0,
    nombrecliente: '',
    apellidopaterno: '',
    apellidomaterno: '',
    telefono: '',
    id_usuario: 0,
    id_domicilio: 0
  };

  usuario: Usuario = {
    nombreusuario: '',
    email: '',
    password: '',
    password2: ''
  };

  domicilio: Domicilio = {
    coloniasSelected: '',
    iddireccioncliente: 0,
    calle: '',
    numero: '',
    interior: '',
    codigopostal: '',
    colonias: [],
    municipio: '',
    entidad: '',
  };

  // 🔥 Nuevas propiedades para búsqueda de usuario
  searchTerm: string = '';
  resultadosBusqueda: any[] = [];
  emailDisabled: boolean = false;


  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private http: HttpClient // 🔥 Importado
  ) {
    this.clienteForm = this.fb.group({
      nombrecliente: ['', Validators.required],
      apellidopaterno: ['', Validators.required],
      apellidomaterno: [''],
      telefono: [''],
      nombreusuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  buscarColoniasPorCP() {
    if (this.domicilio.codigopostal.length === 5) {
      this.pacienteService.obtenerColoniasPorCP(this.domicilio.codigopostal).subscribe(
        (response) => {
          if (Array.isArray(response)) {
            this.domicilio.colonias = [];
            response.forEach(colonia => {
              this.domicilio.colonias.push(colonia.nombrecolonia);
            });
            if (response.length > 0) {
              const { nombremunicipio, nombreentidad } = response[0];
              this.domicilio.municipio = nombremunicipio;
              this.domicilio.entidad = nombreentidad;
            }
          } else {
            console.error('La respuesta no es un array', response);
          }
        },
        (error) => {
          console.error('Error al obtener colonias', error);
        }
      );
    }
  }

  // 🔥 Nuevo: Buscar usuario en base de datos
  buscarUsuario() {
    if (this.searchTerm.trim().length === 0) {
      this.resultadosBusqueda = [];
      return;
    }

    this.http.get<any[]>(`${environment.apiBaseUrl}/pacientes/buscar/${this.searchTerm}`)
      .subscribe({
        next: (data) => {
          this.resultadosBusqueda = data;
        },
        error: (error) => {
          console.error('Error buscando usuario:', error);
        }
      });
  }


  // 🔥 Nuevo: Seleccionar usuario de la búsqueda
  seleccionarUsuario(user: any) {
    this.usuario.nombreusuario = user.nombreusuario;
    this.usuario.email = user.email;
    this.usuario.password = '';
    this.usuario.password2 = '';
    this.emailDisabled = true;
    this.resultadosBusqueda = [];
  }


  onSubmit() {
    if (this.usuario.password !== this.usuario.password2) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.pacienteService.crearPaciente(this.paciente, this.usuario, this.domicilio).subscribe({
      next: (res) => {
        console.log('Paciente y usuario creados correctamente', res);
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
      },
      error: (err) => {
        console.error('Error en registro:', err);
        alert('Hubo un error al registrar el usuario.');
      }
    });
  }
}
