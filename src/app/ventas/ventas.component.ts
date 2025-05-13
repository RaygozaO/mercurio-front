import { Component, OnInit } from '@angular/core';
import { Producto } from './producto.model';
import { CarritoService } from './carrito.services';
import { ProductoService } from './producto.services';
import { FormsModule } from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-ventas',
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.scss'
})
export class VentasComponent implements OnInit {
  productos: Producto[] = [];
  filtro: string = '';
  pagoEfectivo: number = 0;
  cambio: number = 0;
  facturaGenerada: boolean = false;
  fechaFactura: string = new Date().toLocaleString();
  cadenaCfdi: string = '';
  qrUrl: string = '';
  folioFactura: string | undefined
  logoUrl: string = '';

  constructor(
    public carritoService: CarritoService,
    private productoService: ProductoService
  ) {}

  ngOnInit() {
    this.logoUrl = window.location.origin + '/assets/logo_factura.png';
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

  pagarConEfectivo() {
    const totalCompra = this.total();
    if (this.pagoEfectivo < totalCompra) {
      alert('El pago es insuficiente.');
      return;
    }
    this.cambio = this.pagoEfectivo - totalCompra;
    this.facturaGenerada = true;
    this.fechaFactura = new Date().toLocaleString();


    const uuid = this.generarUUID();
    this.cadenaCfdi = `||1.0|${uuid}|${this.fechaFactura}|${this.total().toFixed(2)}|ABC123456789||`;


    this.qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(this.cadenaCfdi)}`;

    alert('Pago realizado con éxito.');
  }

  generarUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


  imprimirFactura() {
    const contenido = document.getElementById('factura')?.innerHTML;
    const ventana = window.open('', '', 'height=600,width=800');
    ventana?.document.write('<html><head><title>Factura</title>');
    ventana?.document.write(`
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border-bottom: 1px solid #ccc; padding: 8px; }
      th { background-color: #f5f5f5; }
      h2 { margin-bottom: 5px; }
      img { height: 80px; }
    </style>
  `);
    ventana?.document.write('</head><body>');
    ventana?.document.write(contenido || '');
    ventana?.document.write('</body></html>');
    ventana?.document.close();
    ventana?.print();
  }
}
