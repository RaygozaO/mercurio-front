import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {InventarioService} from '../../services/inventario.services';
import {AlertaService} from '../../services/alerta.service';

declare var bootstrap: any;

@Component({
  selector: 'app-crear-producto',
  standalone: true,
  templateUrl: './crearProducto.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./crearProducto.component.scss']
})
export class CrearProductoComponent implements AfterViewInit {
  @ViewChild('crearModal') modal!: ElementRef;
  modalInstance: any;
  producto: any = {
    nombre: '',
    precio: 0,
    codigobar: '',
    presentacion: '',
    gramaje: ''
  };

  constructor(private router: Router, private inventarioService: InventarioService,
              private alerta: AlertaService) {}

  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.modal.nativeElement);
    this.modalInstance.show();
  }

  cerrarModal() {
    this.modalInstance.hide();
    this.router.navigate(['/admin/inventario']);
  }

  guardarProducto() {
    console.log('Guardando producto:', this.producto);

    this.inventarioService.crearProducto(this.producto).subscribe({
      next: (res) => {
        this.alerta.info('Producto creado');
        this.cerrarModal();
      },
      error: (err) => {
        this.alerta.error('Error al crear producto:');
      }
    });
  }
}
