import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Paciente, Domicilio, Usuario, Colonia, Rol } from './Paciente.model';
import { PacienteService } from '../services/paciente.services';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { EspecialidadService } from '../services/especialidad.services';
import { HorariosService, Horario } from '../services/horarios.service';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.scss'
})
export class PacientesComponent {
  clienteForm: FormGroup;
  roles: Rol[] = [];
  turnos: Horario[] = [];
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
    password2: '',
    id_rol: 0,
    enabled: true,
  };

  domicilio: Domicilio = {
    id_codigopostal: 0,
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

  medico = {
    cedula: '',
    telefono: '',
    idespecialidad: null,
    id_turno: null
  };

  especialidades: any[] = [];
  searchTerm: string = '';
  resultadosBusqueda: any[] = [];
  emailDisabled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private http: HttpClient,
    private especialidadService: EspecialidadService,
    private horariosService: HorariosService,
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

  ngOnInit(): void {
    this.cargarRoles();
    this.cargarEspecialidades();
    this.cargarHorarios();
  }

  buscarColoniasPorCP() {
    if (this.domicilio.codigopostal && this.domicilio.codigopostal.length === 5) {
      this.pacienteService.obtenerColoniasPorCP(this.domicilio.codigopostal).subscribe(
        (response) => {
          if (Array.isArray(response) && response.length > 0) {
            this.domicilio.colonias = response;
            const primeraColonia = response[0];
            this.domicilio.coloniasSelected = primeraColonia;

            if (primeraColonia) {
              this.onColoniaChange(primeraColonia); // ✅ Tipo garantizado: Colonia
            }
          } else {
            console.warn('⚠️ No se encontraron colonias para este CP');
            this.domicilio.colonias = [];
          }
        },
        (error) => {
          console.error('❌ Error al obtener colonias:', error);
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

  cargarEspecialidades() {
    this.especialidadService.getEspecialidades().subscribe(data => {
      this.especialidades = data;
    });
  }
  cargarHorarios() {
    this.horariosService.obtenerHorarios().subscribe({
      next: (data) => this.turnos = data,
      error: (err) => console.error('Error cargando horarios', err)
    });
  }

  onColoniaChange(colonia: Colonia): void {
    if (!colonia) return;

    this.domicilio.coloniasSelected = colonia;
    this.domicilio.municipio = colonia.nombremunicipio;
    this.domicilio.entidad = colonia.nombreentidad;
    this.domicilio.id_colonia = colonia.idcolonia;
    this.domicilio.id_municipio = colonia.idmunicipio;
    this.domicilio.id_codigopostal = colonia.id_codigopostal;
    this.domicilio.id_entidad = colonia.identidadfederativa;

    console.log('🧠 Colonia seleccionada:', colonia);
    console.log('📦 Domicilio armado:', this.domicilio);
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

      const crearPacienteRequest: any = {
        paciente: {
          nombrecliente: this.paciente.nombrecliente,
          apellidopaterno: this.paciente.apellidopaterno,
          apellidomaterno: this.paciente.apellidomaterno,
          telefono: this.paciente.telefono
        },
        usuario: {
          idusuario: this.usuario.idusuario,
          nombreusuario: this.usuario.nombreusuario,
          email: this.usuario.email,
          password: this.usuario.password,
          id_rol: this.usuario.id_rol,
          enabled: 1
        },
        domicilio: {
          calle: this.domicilio.calle,
          numero: this.domicilio.numero,
          interior: this.domicilio.interior,
          id_colonia: this.domicilio.id_colonia,
          id_municipio: this.domicilio.id_municipio,
          id_codigopostal: this.domicilio.id_codigopostal,
          id_entidad: this.domicilio.id_entidad
        }
      };
      if (String(this.usuario.id_rol) === '5') {
        crearPacienteRequest.medico = {
          cedula: this.medico.cedula,
          telefono: this.medico.telefono,
          idespecialidad: this.medico.idespecialidad,
          id_turno: this.medico.id_turno
        };
      }

      const clienteResponse = await this.pacienteService.crearPacienteCompleto(crearPacienteRequest);


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
      password2: '',
      id_rol: 0,
      enabled: true
    };
    this.domicilio = {
      id_codigopostal: 0,
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

  cargarRoles(): void {
    this.pacienteService.getRolesActivos().subscribe({
      next: (res) => {
        this.roles = res;
      },
      error: (err) => {
        console.error('Error al cargar roles', err);
      }
    });
  }
}
