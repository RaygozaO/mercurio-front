import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InventarioService } from '../../services/inventario.services';
import {AlertaService} from '../../services/alerta.service';

declare var bootstrap: any;
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-faltantes-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faltantesProducto.component.html',
  styleUrls: ['./faltantesProducto.component.scss']
})
export class FaltantesProductoComponent implements AfterViewInit {
  @ViewChild('faltantesModal') modal!: ElementRef;
  modalInstance: any;
  productosFaltantes: any[] = [];

  constructor(private router: Router,
              private inventarioService: InventarioService,
              private alerta: AlertaService
  ) {}

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.modal.nativeElement);
    this.modalInstance.show();
    this.cargarFaltantes();
  }

  cerrarModal(): void {
    this.modalInstance.hide();
    this.router.navigate(['/admin/inventario']);
  }

  cargarFaltantes(): void {
    this.inventarioService.obtenerFaltantes().subscribe({
      next: (res) => {
        this.productosFaltantes = res;
      },
      error: (err) => {
        this.alerta.error('Error al cargar faltantes ');
      }
    });
  }

  imprimirPDF(): void {
    const doc = new jsPDF();
    doc.text('Lista de Productos Faltantes', 14, 20);
    autoTable(doc, {
      head: [[ 'Nombre', 'Stock']],
      body: this.productosFaltantes.map(p => [p.nombre, p.numexistencia])
    });
    doc.save('faltantes.pdf');
  }
}
