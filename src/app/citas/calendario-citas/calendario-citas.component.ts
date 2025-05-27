import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import { CitasService } from '../citas.service';
import {AlertaService} from '../../services/alerta.service';

declare var bootstrap: any;

@Component({
  selector: 'app-calendario-citas',
  standalone: true,
  templateUrl: './calendario-citas.component.html',
  styleUrls: ['./calendario-citas.component.scss'],
  imports: [FormsModule, NgForOf, NgIf, NgStyle, NgClass]
})
export class CalendarioCitasComponent implements OnInit, AfterViewInit {
  constructor(private citas: CitasService,private alerta: AlertaService) {
  }

  diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  anios: number[] = [];

  mesSeleccionado: number = new Date().getMonth();
  anioSeleccionado: number = new Date().getFullYear();
  diasDelMes: ({ dia: number, esDomingo: boolean, esPasado: boolean } | null)[] = [];


  fechaSeleccionada = '';
  nuevoMotivo = '';
  doctores: any[] = [];
  doctorSeleccionado: string = '';
  horasDisponibles: string[] = [];
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

    this.diasDelMes = Array(primerDiaSemana).fill(null);

    for (let i = 1; i <= diasMes; i++) {
      const diaFecha = new Date(this.anioSeleccionado, this.mesSeleccionado, i);
      const hoy = new Date();

      const esDomingo = diaFecha.getDay() === 0;
      const esPasado = diaFecha < new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      this.diasDelMes.push({ dia: i, esDomingo, esPasado });
    }
  }


  actualizarCalendario(): void {
    this.generarDiasDelMes();
  }

  seleccionarDia(dia: number): void {
    const hoy = new Date();
    const fechaSeleccionadaDate = new Date(this.anioSeleccionado, this.mesSeleccionado, dia);
    const esPasado = fechaSeleccionadaDate < new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    const mes = String(this.mesSeleccionado + 1).padStart(2, '0');
    const diaStr = String(dia).padStart(2, '0');
    this.fechaSeleccionada = `${this.anioSeleccionado}-${mes}-${diaStr}`;

    this.cargarCitasDelDia(this.fechaSeleccionada);

    // 👉 Solo abrir el modal si NO es día pasado
    if (!esPasado && this.bsModal) {
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
    if (this.nuevaHora.length === 5) {
      this.nuevaHora += ':00';
    }
    console.log('Comparando hora:', this.nuevaHora, 'contra', this.listaCitas.map(c => c.hora));

    if (!idCliente || !this.doctorSeleccionado || !this.nuevaHora || !this.fechaSeleccionada) {
      this.alerta.warning('⚠️ Faltan datos para guardar la cita');
      return;
    }

    // ✅ 1. Verifica si ya existe una cita para ese doctor, fecha y hora
    const citaOcupada = this.listaCitas.some(c =>
      c.idmedico === +this.doctorSeleccionado && c.hora === this.nuevaHora
    );

    if (citaOcupada) {
      this.alerta.error('❌ Ya hay una cita registrada para ese médico a esa hora.');
      return;
    }

    // ✅ 2. Obtener horario del médico seleccionado
    const doctor = this.doctores.find(d => d.idusuario == this.doctorSeleccionado);
    console.log('docto horario', doctor.id_horario);
    if (!doctor || !doctor.desde || !doctor.hasta) {
      this.alerta.error('❌ El médico no tiene un horario configurado.');
      return;
    }
    if (!doctor.id_horario) {
      this.alerta.error('❌ El médico no tiene un ID de horario válido.');
      return;
    }

    // ✅ 3. Validar si la hora está fuera del rango permitido
    if (this.nuevaHora < doctor.desde || this.nuevaHora > doctor.hasta) {
      this.alerta.error(`❌ La hora ${this.nuevaHora} está fuera del horario permitido: ${doctor.desde} - ${doctor.hasta}`);
      return;
    }
    console.log('🧪 Comparando contra cliente ID:', idCliente);
    console.table(this.listaCitas.map(c => ({ hora: c.hora, idcliente: c.idcliente })));

    // Validar si el paciente ya tiene una cita a esa hora
    const pacienteYaTieneCita = this.listaCitas.some(c =>
      +c.idcliente === idCliente && c.hora === this.nuevaHora
    );

    if (pacienteYaTieneCita) {
      console.warn('❌ El paciente ya tiene una cita en ese horario');
      this.alerta.error(`❌ Ya tienes una cita registrada a las ${this.nuevaHora}.`);
      return;
    }
    console.log('🕵️ Verificando si el paciente ya tiene cita a esa hora...');
    console.log('ID Cliente:', idCliente, 'Hora nueva:', this.nuevaHora);
    console.log('listaCitas:', this.listaCitas);


    if (!this.listaCitas || this.listaCitas.length === 0) {
      this.alerta.warning('⚠️ Citas del día aún no cargadas. Intenta de nuevo.');
      return;
    }

    // ✅ 4. Crear cita si pasa todas las validaciones
    const nuevaCita = {
      title: this.nuevoMotivo || 'Cita médica',
      start: this.fechaSeleccionada,
      horacita: this.nuevaHora,
      end: this.fechaSeleccionada,
      color: '#00aaff',
      id_cliente: idCliente,
      id_usuario: this.doctorSeleccionado,
      id_horario: doctor.id_horario,
      enabled: true
    };


    this.citas.crearCita(nuevaCita).subscribe({
      next: () => {
        this.alerta.info('✅ Cita creada');
        this.bsModal.hide();
        this.cargarCitasDelDia(this.fechaSeleccionada);
        this.nuevoMotivo = '';
        this.doctorSeleccionado = '';
        this.nuevaHora = '';
      },
      error: (err) => {
        const mensaje = err?.error?.message || '❌ Error al guardar cita';
        this.alerta.error(mensaje);
      }
    });
  }
  actualizarHorasDisponibles(): void {
    const doctor = this.doctores.find(d => d.idusuario == this.doctorSeleccionado);
    if (!doctor || !doctor.desde || !doctor.hasta) {
      this.horasDisponibles = [];
      return;
    }

    const [hInicio] = doctor.desde.split(':').map(Number);
    const [hFin] = doctor.hasta.split(':').map(Number);

    const horas: string[] = [];
    for (let h = hInicio; h <= hFin; h++) {
      horas.push(`${h.toString().padStart(2, '0')}:00`);
      horas.push(`${h.toString().padStart(2, '0')}:30`);
    }

    this.horasDisponibles = horas.filter(h => h >= doctor.desde && h <= doctor.hasta);
  }

  cargarCitasDelDia(fecha: string): void {
    this.citas.getCitasPorFecha(fecha).subscribe({
      next: (data) => {
        console.log('Citas recibidas', data);

        // ✅ Normalizar propiedades
        this.listaCitas = data.map(c => ({
          ...c,
          hora: c.hora || c.horacita,
          idmedico: c.Medico || c.id_usuario || c.idmedico || 0,
          idcliente: c.Cliente || c.id_cliente || c.idcliente || c.cliente || 0
        }));
      },
      error: (err) => {
        this.alerta.error('❌ Error al cargar citas del día:');
      }
    });
  }
  esHoraOcupada(hora: string): boolean {
    return this.listaCitas.some(c => c.hora === hora && +c.idmedico === +this.doctorSeleccionado);
  }


}
