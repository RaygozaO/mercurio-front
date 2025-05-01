import {Component, OnInit} from '@angular/core';
import {Producto} from './producto.model';
import {CarritoService} from './carrito.services';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {ProductoService} from './producto.services';

@Component({
  selector: 'app-ventas',
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.scss'
})
export class VentasComponent implements OnInit {
  productos: Producto[] = [];
  filtro: string = '';

  constructor(public carritoService: CarritoService,
              private productoService: ProductoService) {}

  ngOnInit() {
    this.productoService.obtenerProductos().subscribe({
      next: (datos) => {
        this.productos = datos;
      },
      error: (error) => {
        console.error('Error al cargar productos', error);
      }
    });
  }
  productosFiltrados(): Producto[] {
    return this.productos
      .filter(p => p.nombre.toLowerCase().includes(this.filtro.toLowerCase()))
      .slice(0, 5);
  }

  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregar(producto);
  }

  total() {
    return this.carritoService.obtenerTotal();
  }
}
