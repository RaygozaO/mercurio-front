import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import { InventarioService } from '../services/inventario.services';
import { Producto } from '../ventas/producto.model';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-inventario',
  imports: [
    RouterLink,
    RouterOutlet,
    CommonModule,
    FormsModule
  ],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.scss'
})

export class InventarioComponent implements OnInit {
  productos: Producto[] = [];
  filtro: string = ''

  constructor(private inventarioService: InventarioService) {
  }

  ngOnInit() {
    this.inventarioService.obtenerProductos().subscribe({
      next: (data) => this.productos = data,
      error: (error) => console.log(error)
      });
  }
  productosFiltrados() {
    return this.productos
      .filter(p => p.nombre.toLowerCase().includes(this.filtro.toLowerCase()))
      .slice(0, 5);
  }
}
