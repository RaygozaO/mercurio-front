import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import { CitasService } from '../citas.service';
import {AlertaService} from '../../services/alerta.service';

declare var bootstrap: any;

@Component({
  selector: 'app-calendario-citas',
  standalone: true,
  templateUrl: './calendario-citas.component.html',
  styleUrls: ['./calendario-citas.component.scss'],
  imports: [FormsModule, NgForOf, NgIf, NgStyle]
})
export class CalendarioCitasComponent implements OnInit, AfterViewInit {
  constructor(private citas: CitasService,private alerta: AlertaService) {
  }

  diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  anios: number[] = [];

  mesSeleccionado: number = new Date().getMonth();
  anioSeleccionado: number = new Date().getFullYear();
  diasDelMes: (number | null)[] = [];

  fechaSeleccionada = '';
  nuevoMotivo = '';
  doctores: any[] = [];
  doctorSeleccionado: string = '';
  nuevaHora = '';
  listaCitas: any[] = [];

  @ViewChild('modalNuevaCitaRef') modalNuevaCitaRef!: ElementRef;
  bsModal: any;

  ngOnInit(): void {
    const anioActual = new Date().getFullYear();
    this.anios = Array.from({length: 5}, (_, i) => anioActual - 1 + i);
    this.generarDiasDelMes();
    this.cargarDoctores();
  }

  ngAfterViewInit(): void {
    if (this.modalNuevaCitaRef) {
      this.bsModal = new bootstrap.Modal(this.modalNuevaCitaRef.nativeElement);
    }
  }

  generarDiasDelMes(): void {
    const fecha = new Date(this.anioSeleccionado, this.mesSeleccionado, 1);
    const primerDiaSemana = fecha.getDay();
    const diasMes = new Date(this.anioSeleccionado, this.mesSeleccionado + 1, 0).getDate();

    this.diasDelMes = Array(primerDiaSemana).fill(null).concat(
      Array.from({length: diasMes}, (_, i) => i + 1)
    );
  }

  actualizarCalendario(): void {
    this.generarDiasDelMes();
  }

  seleccionarDia(dia: number): void {
    const mes = String(this.mesSeleccionado + 1).padStart(2, '0');
    const diaStr = String(dia).padStart(2, '0');
    this.fechaSeleccionada = `${this.anioSeleccionado}-${mes}-${diaStr}`;
    this.cargarCitasDelDia(this.fechaSeleccionada);
    if (this.bsModal) {
      this.bsModal.show();
    }
  }

  cargarDoctores(): void {
    this.citas.getDoctores().subscribe((data: any[]) => {
      this.doctores = data;
    });
  }


  guardarCita(): void {
    const idCliente = Number(localStorage.getItem('id_cliente'));
    console.log(idCliente);

    if (!idCliente || !this.doctorSeleccionado || !this.nuevaHora || !this.fechaSeleccionada) {
      this.alerta.warning('Faltan datos para guardar la cita');
      return;
    }

    const nuevaCita = {
      title: this.nuevoMotivo || 'Cita médica',
      start: this.fechaSeleccionada,
      horacita: this.nuevaHora,
      end: this.fechaSeleccionada,
      color: '#00aaff', // puedes hacerlo dinámico si quieres
      id_cliente: idCliente,
      id_usuario: this.doctorSeleccionado,
      id_horario: 2,
      enabled: true
    };

    this.citas.crearCita(nuevaCita).subscribe({
      next: (res) => {
        this.alerta.info('✅ Cita creada');
        this.bsModal.hide();
      },
      error: (err) => {
        this.alerta.error('❌ Error al guardar cita');
      }
    });
  }

  cargarCitasDelDia(fecha: string): void {
    this.citas.getCitasPorFecha(fecha).subscribe({
      next: (data) => {
        console.log('Citas recibidas',data);
        this.listaCitas = data;
      },
      error: (err) => {
        this.alerta.error('❌ Error al cargar citas del día:');
      }
    });
  }

}
