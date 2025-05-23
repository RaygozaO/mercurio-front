import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, RouterOutlet, FormsModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  terminoBusqueda = '';
  sugerencias: string[] = [];

  opciones = ['recetas', 'pacientes', 'citas', 'inventario'];

  constructor(private router: Router) {}

  filtrarSugerencias() {
    const termino = this.terminoBusqueda.toLowerCase().trim();
    this.sugerencias = termino
      ? this.opciones.filter(op => op.includes(termino))
      : [];
  }

  seleccionarSugerencia(sugerencia: string) {
    this.terminoBusqueda = sugerencia;
    this.sugerencias = [];
    this.buscar();
  }

  buscar() {
    const termino = this.terminoBusqueda.toLowerCase().trim();

    if (!termino) return;

    if (termino.includes('receta')) {
      this.router.navigate(['/admin/recetas']);
    } else if (termino.includes('paciente')) {
      this.router.navigate(['/admin/pacientes']);
    } else if (termino.includes('cita')) {
      this.router.navigate(['/admin/citas']);
    } else if (termino.includes('inventario')) {
      this.router.navigate(['/admin/inventario']);
    } else {
      this.router.navigate(['/admin/busqueda'], { queryParams: { q: termino } });
    }
  }
}
