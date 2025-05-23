import { Component, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule} from '@angular/forms';
import { Referencia, ReferenciaService} from './referencia.service';
import { AlertaService } from '../services/alerta.service';
import { CitasService} from '../citas/citas.service';
import { PacienteService } from '../services/paciente.services';

@Component({
  selector: 'app-referencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './referencia.component.html',
  styleUrl: './referencia.component.scss'
})
export class ReferenciaComponent implements OnInit {
  referencia: Referencia = {
    idmedico_origen: 1, // puedes cambiar esto por el médico logueado
    idmedico_destino: 2,
    idpaciente: 1,
    motivo: ''
  };

  referencias: any[] = [];

  constructor(
    private referenciaService: ReferenciaService,
    private alerta: AlertaService,
    private citasService: CitasService,
    private pacienteService: PacienteService,
  ) { }
  doctores: any[] = [];
  nombrePaciente: string = '';
  searchPaciente: string = '';
  resultadosPaciente: any[] = [];
  pacienteActual: any = null;

  ngOnInit(): void {
    this.referencia.idpaciente = Number(localStorage.getItem('id_cliente')) || 0;
    this.nombrePaciente = localStorage.getItem('nombrePaciente') || 'Paciente desconocido';
    this.cargarDoctores();
    this.cargarReferencias();
  }
  cargarDoctores() {
    this.citasService.getDoctores().subscribe({
      next: (res) => {
        this.doctores = res;
      },
      error: () => {
        this.alerta.error('Error al cargar médicos');
      }
    });
  }
  buscarPaciente(): void {
    if (this.searchPaciente.trim().length === 0) {
      this.resultadosPaciente = [];
      return;
    }

    this.pacienteService.buscarPaciente(this.searchPaciente).subscribe({
      next: (data) => {
        this.resultadosPaciente = data;
      },
      error: (err) => {
        this.alerta.error('Error buscando paciente');
        console.error(err);
      }
    });
  }
  seleccionarPaciente(paciente: any): void {
    this.referencia.idpaciente = paciente.idcliente;
    this.pacienteActual = paciente;
    this.searchPaciente = `${paciente.nombrecliente} ${paciente.apellidopaterno}`;
    this.resultadosPaciente = [];
  }
  crearReferencia() {
    if (!this.referencia.idmedico_destino || !this.referencia.idpaciente || !this.referencia.motivo.trim()) {
      this.alerta.warning('Completa todos los campos antes de continuar');
      return;
    }

    this.referenciaService.crearReferencia(this.referencia).subscribe({
      next: () => {
        this.alerta.success('Referencia creada exitosamente');
        this.referencia.motivo = '';
        this.cargarReferencias();
      },
      error: () => {
        this.alerta.error('Error al crear la referencia');
      }
    });
  }


  cargarReferencias() {
    this.referenciaService.obtenerTodas().subscribe(data => {
      this.referencias = data;
    });
  }
}
