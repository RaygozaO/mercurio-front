import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Paciente, Domicilio, Usuario, Colonia } from './Paciente.model';
import { PacienteService } from '../services/paciente.services';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-pacientes',
  standalone: true,
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
    id_domicilio: 0,
  };

  usuario: Usuario = {
    idusuario: 0,
    nombreusuario: '',
    email: '',
    password: '',
    password2: ''
  };

  domicilio: Domicilio = {
    coloniasSelected: null,
    iddireccioncliente: 0,
    calle: '',
    numero: '',
    interior: '',
    codigopostal: '',
    colonias: [],
    municipio: '',
    entidad: '',
  };

  searchTerm: string = '';
  resultadosBusqueda: any[] = [];
  emailDisabled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private http: HttpClient
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
    if (this.domicilio.codigopostal && this.domicilio.codigopostal.length === 5) {
      this.pacienteService.obtenerColoniasPorCP(this.domicilio.codigopostal).subscribe(
        (response) => {
          if (Array.isArray(response)) {
            this.domicilio.colonias = response;
            if (response.length > 0) {
              this.domicilio.municipio = response[0].nombremunicipio;
              this.domicilio.entidad = response[0].nombreentidad;
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

  buscarUsuario() {
    if (this.searchTerm.trim().length === 0) {
      this.resultadosBusqueda = [];
      return;
    }

    this.http.get<any[]>(`${environment.apiBaseUrl}/pacientes/buscar/${this.searchTerm}`)
      .subscribe({
        next: (data) => this.resultadosBusqueda = data,
        error: (error) => console.error('Error buscando usuario:', error)
      });
  }

  onColoniaChange() {
    console.log('Colonia seleccionada:', this.domicilio.coloniasSelected);
  }

  seleccionarUsuario(user: any) {
    this.usuario.idusuario = user.idusuario;
    this.usuario.nombreusuario = user.nombreusuario;
    this.usuario.email = user.email;
    this.usuario.password = '';
    this.usuario.password2 = '';
    this.emailDisabled = true;
    this.resultadosBusqueda = [];

    this.clienteForm.patchValue({
      nombreusuario: user.nombreusuario,
      email: user.email
    });
  }

  async onSubmit() {
    try {
      if (this.usuario.password !== this.usuario.password2) {
        alert('Las contraseñas no coinciden');
        return;
      }

      if (!this.usuario.nombreusuario || !this.usuario.email) {
        alert('Debes seleccionar un usuario');
        return;
      }

      if (!this.domicilio.coloniasSelected) {
        alert('Debes seleccionar una colonia.');
        return;
      }

      // No usamos clienteForm ya, todo es via ngModel
      const crearPacienteRequest = {
        paciente: {
          nombrecliente: this.paciente.nombrecliente,
          apellidopaterno: this.paciente.apellidopaterno,
          apellidomaterno: this.paciente.apellidomaterno,
          telefono: this.paciente.telefono
        },
        usuario: {
          idusuario: this.usuario.idusuario, // si viene ID hacemos UPDATE
          nombreusuario: this.usuario.nombreusuario,
          email: this.usuario.email,
          password: this.usuario.password
        },
        domicilio: {
          calle: this.domicilio.calle,
          numero: this.domicilio.numero,
          interior: this.domicilio.interior,
          coloniasSelected: this.domicilio.coloniasSelected.nombrecolonia
        }
      };

      console.log('Datos enviados a crearPaciente:', crearPacienteRequest);

      const clienteResponse = await this.pacienteService.crearPacienteCompleto(crearPacienteRequest);
      console.log('Paciente creado:', clienteResponse);

      if (!clienteResponse?.id) {
        throw new Error('No se pudo obtener el ID del paciente creado.');
      }

      alert('Paciente, domicilio y usuario creados exitosamente');
      this.resetForm();

    } catch (error) {
      console.error('Error al crear paciente:', error);
      alert('Hubo un error al crear el paciente. Revisa la consola.');
    }
  }


  resetForm() {
    this.paciente = {
      idcliente: 0,
      nombrecliente: '',
      apellidopaterno: '',
      apellidomaterno: '',
      telefono: '',
      id_usuario: 0,
      id_domicilio: 0,
    };
    this.usuario = {
      idusuario: 0,
      nombreusuario: '',
      email: '',
      password: '',
      password2: ''
    };
    this.domicilio = {
      coloniasSelected: null,
      iddireccioncliente: 0,
      calle: '',
      numero: '',
      interior: '',
      codigopostal: '',
      colonias: [],
      municipio: '',
      entidad: '',
    };
    this.searchTerm = '';
    this.resultadosBusqueda = [];
  }
}
