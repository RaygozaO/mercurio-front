import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { CitasService } from '../citas.service';

declare var bootstrap: any;

@Component({
  selector: 'app-calendario-citas',
  standalone: true,
  templateUrl: './calendario-citas.component.html',
  styleUrls: ['./calendario-citas.component.scss'],
  imports: [FormsModule,  NgForOf]
})
export class CalendarioCitasComponent implements OnInit, AfterViewInit {
  constructor(private citas: CitasService) {
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
    this.anios = Array.from({length: 5}, (_, i) => anioActual - 0 + i);
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
    this.listaCitas.push({
      fecha: this.fechaSeleccionada,
      motivo: this.nuevoMotivo,
      hora: this.nuevaHora,
      idmedico: this.doctorSeleccionado
    });

    if (this.bsModal) {
      this.bsModal.hide();
    }
  }
}
