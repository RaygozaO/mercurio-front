import { Component, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule} from '@angular/forms';
import { Referencia, ReferenciaService} from './referencia.service';

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

  constructor(private referenciaService: ReferenciaService) {}

  ngOnInit(): void {
    this.cargarReferencias();
  }

  crearReferencia() {
    this.referenciaService.crearReferencia(this.referencia).subscribe(() => {
      alert('✅ Referencia creada');
      this.referencia.motivo = '';
      this.cargarReferencias();
    });
  }

  cargarReferencias() {
    this.referenciaService.obtenerTodas().subscribe(data => {
      this.referencias = data;
    });
  }
}
