// carrito.service.ts
import { Injectable } from '@angular/core';
import { Producto } from './producto.model';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private carrito: { producto: Producto; cantidad: number }[] = [];

  agregar(producto: Producto, cantidad: number = 1): void {
    const existente = this.carrito.find(p => p.producto.idproductos === producto.idproductos);
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      this.carrito.push({ producto, cantidad });
    }
  }

  eliminar(idProducto: number): void {
    this.carrito = this.carrito.filter(item => item.producto.idproductos !== idProducto);
  }

  obtenerCarrito() {
    return this.carrito;
  }

  obtenerTotal(): number {
    return this.carrito.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
  }

  limpiar() {
    this.carrito = [];
  }
}
