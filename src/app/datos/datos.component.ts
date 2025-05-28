import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../services/perfil.service';
import { ColoniasService } from '../services/colonias.service';
import { FormsModule } from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-datos',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.scss']
})
export class DatosComponent implements OnInit {
  usuario: any = { nombreusuario: '', email: '', password: '', password2: '', id_rol: null };
  paciente: any = { nombrecliente: '', apellidopaterno: '', apellidomaterno: '', telefono: '' };
  domicilio: any = {
    calle: '', numero: '', interior: '',
    codigopostal: '', coloniasSelected: null, colonias: [],
    municipio: '', entidad: '', id_colonia: null,
    id_municipio: null, id_codigopostal: null, id_entidad: null
  };
  medico: any = { telefono: '', cedula: '', idespecialidad: null, id_turno: null };

  emailDisabled: boolean = true;
  roles: any[] = [];
  turnos: any[] = [];
  especialidades: any[] = [];

  constructor(
    private perfilService: PerfilService,
    private coloniasService: ColoniasService
  ) {}

  ngOnInit(): void {
    this.buscarUsuario();
  }
  datosCargados: boolean = false;

  buscarUsuario(): void {
    this.perfilService.obtenerPerfil().subscribe(data => {
      console.log('✅ Datos cargados:', data);

      this.usuario = data.usuario;
      this.paciente = data.paciente;
      this.domicilio = data.domicilio;

      if (data.medico) {
        this.medico = data.medico;
      }

      this.roles = data.roles || [];
      this.turnos = data.turnos || [];
      this.especialidades = data.especialidades || [];
      this.datosCargados = true;
    });
  }

  buscarColoniasPorCP(): void {
    const cp = this.domicilio.codigopostal;
    if (cp && cp.length >= 5) {
      this.coloniasService.buscarPorCodigoPostal(cp).subscribe(colonias => {
        this.domicilio.colonias = colonias;
      });
    }
  }

  onColoniaChange(coloniaSeleccionada: any): void {
    if (coloniaSeleccionada) {
      this.domicilio.id_colonia = coloniaSeleccionada.idcolonia;
      this.domicilio.id_municipio = coloniaSeleccionada.idmunicipio;
      this.domicilio.id_codigopostal = coloniaSeleccionada.id_codigopostal;
      this.domicilio.id_entidad = coloniaSeleccionada.identidadfederativa;
      this.domicilio.municipio = coloniaSeleccionada.nombremunicipio;
      this.domicilio.entidad = coloniaSeleccionada.nombreentidad;
    }
  }

  onSubmit(): void {
    const payload: any = {
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

    if (this.usuario.id_rol == 5) {
      payload.medico = {
        telefono: this.medico.telefono,
        cedula: this.medico.cedula,
        idespecialidad: this.medico.idespecialidad,
        id_turno: this.medico.id_turno
      };
    }

    this.perfilService.actualizarPerfil(payload).subscribe({
      next: () => alert('✅ Datos actualizados correctamente'),
      error: err => console.error('❌ Error al actualizar', err)
    });
  }
}
