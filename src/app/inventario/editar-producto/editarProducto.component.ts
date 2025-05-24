import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../../services/inventario.services';
import {AlertaService} from '../../services/alerta.service';

declare var bootstrap: any;

@Component({
  selector: 'app-editar-producto',
  standalone: true,
  templateUrl: './editarProducto.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./editarProducto.component.scss']
})
export class EditarProductoComponent implements AfterViewInit, OnInit {
  @ViewChild('editarModal') modal!: ElementRef;
  modalInstance: any;
  idProducto!: number;
  producto: any = {
    nombre: '',
    precio: 0,
    codigobar: '',
    presentacion: '',
    gramaje: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inventarioService: InventarioService,
    private alerta: AlertaService
  ) {}

  ngOnInit(): void {
    this.idProducto = Number(this.route.snapshot.paramMap.get('id'));
    console.log('📝 Editando producto ID:', this.idProducto);

    this.inventarioService.obtenerProducto(this.idProducto).subscribe({
      next: (res) => {
        console.log('Producto cargado:', res);
        this.producto = res; // asumimos que devuelve el producto completo
      },
      error: (err) => {
        this.alerta.error('Error al cargar producto ');
      }
    });
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.modal.nativeElement);
    this.modalInstance.show();
  }

  cerrarModal() {
    this.modalInstance.hide();
    this.router.navigate(['/admin/inventario']);
  }

  guardarCambios() {
    this.alerta.warning('Guardando cambios de producto:');

    this.inventarioService.actualizarProducto(this.idProducto, this.producto).subscribe({
      next: (res) => {
        this.alerta.warning('✅ Producto actualizado ');
        this.cerrarModal();
      },
      error: (err) => {
        this.alerta.error('Error al actualizar producto:');
      }
    });
  }
}
