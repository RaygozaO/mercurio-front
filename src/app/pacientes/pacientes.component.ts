import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
import {Paciente, Domicilio, Usuario} from './Paciente.model';
import {PacienteService} from '../services/paciente.services';

@Component({
  selector: 'app-pacientes',
  imports: [CommonModule,FormsModule],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.scss'
})
export class PacientesComponent {
  clienteForm: FormGroup; // Declarar FormGroup para el formulario
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
  //colonias: (NgIterable<unknown> & NgIterable<any>) | undefined | null;

  constructor(private fb: FormBuilder, private pacienteService: PacienteService) {
    // Inicializa el formulario
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
          // Verificar si la respuesta es un array
          if (Array.isArray(response)) {
            // Limpiar el array de colonias antes de llenarlo
            this.domicilio.colonias = [];

            // Iterar sobre la respuesta y agregar los nombres de las colonias
            response.forEach(colonia => {
              this.domicilio.colonias.push(colonia.nombrecolonia);
            });

            // Si hay al menos una colonia, extraer municipio y entidad
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
