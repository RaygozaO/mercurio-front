import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { ProductoService } from '../ventas/producto.services';
import {NgForOf, NgIf} from '@angular/common';
import { CitasService } from '../citas/citas.service';
import { PacienteService } from '../services/paciente.services';
import { RecetaService } from '../services/receta.services'; // ajusta la ruta si es diferente



@Component({
  selector: 'app-recetas',
  imports: [
    ReactiveFormsModule,
    NgForOf,
    FormsModule,
    NgIf
  ],
  templateUrl: './recetas.component.html',
  styleUrl: './recetas.component.scss'
})
export class RecetasComponent implements OnInit{
  recetaForm!: FormGroup;
  productosDisponibles: any[] = [];
  doctores: any[] = [];
  doctorSeleccionado: string = '';
  searchTerm = '';
  resultadosBusqueda: any[] = [];
  busquedaProducto = '';
  productosFiltrados: any[] = [];


  constructor(
    private fb: FormBuilder,
    private productosService: ProductoService,
    private citas: CitasService,
    private pacienteService: PacienteService,
    private recetaService: RecetaService,
  ) {}

  ngOnInit(): void {
    this.recetaForm = this.fb.group({
      resumenclinico: ['', Validators.required],
      indicaciones: ['', Validators.required],
      idmedico: ['', Validators.required],
      idpaciente: ['', Validators.required],
      historial: ['', Validators.required],
      productos: this.fb.array([])
    });

    this.productosService.obtenerProductos().subscribe((res) => {
      this.productosDisponibles = res;
    });
    this.cargarDoctores();
  }

  cargarDoctores(): void {
    this.citas.getDoctores().subscribe((data: any[]) => {
      this.doctores = data;
    });
  }
  buscarPaciente(): void {
    if (this.searchTerm.trim().length === 0) {
      this.resultadosBusqueda = [];
      return;
    }

    this.pacienteService.buscarPaciente(this.searchTerm).subscribe({
      next: (data) => {
        console.log('📋 Pacientes encontrados:', data);
        this.resultadosBusqueda = data;
      },
      error: (err) => console.error('Error buscando paciente:', err)
    });
  }

  seleccionarPaciente(paciente: any): void {
    console.log('Paciente seleccionado:', paciente);
    this.recetaForm.patchValue({
      idpaciente: paciente.idcliente
    });
    this.resultadosBusqueda = [];
    this.searchTerm = `${paciente.nombrecliente} ${paciente.apellidopaterno}`;
  }

  get productos(): FormArray {
    return this.recetaForm.get('productos') as FormArray;
  }
  get productosFormGroups(): FormGroup[] {
    return this.productos.controls as FormGroup[];
  }

  filtrarProductos(): void {
    const termino = this.busquedaProducto.trim().toLowerCase();

    if (termino.length === 0) {
      this.productosFiltrados = [];
      return;
    }

    this.productosFiltrados = this.productosDisponibles.filter(p =>
      p.nombre.toLowerCase().includes(termino)
    );
  }

  agregarProducto(producto: any): void {
    this.productos.push(this.fb.group({
      id_productos: [producto.idproductos],
      nombre: [producto.nombre],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    }));
  }

  eliminarProducto(index: number): void {
    this.productos.removeAt(index);
  }

  guardarReceta(): void {
    if (this.productos.length === 0) {
      alert('Debes agregar al menos un producto a la receta.');
      return;
    }
    if (this.recetaForm.invalid) {
      alert('Faltan datos requeridos o hay errores de validación.');
      this.recetaForm.markAllAsTouched();
      console.warn('❌ Formulario inválido:', this.recetaForm.value);
      console.warn('🧩 Estado de validación:', this.recetaForm);
      return;
    }

    const formValue = this.recetaForm.value;

    const recetaPayload = {
      resumenclinico: formValue.resumenclinico,
      indicaciones: formValue.indicaciones,
      idmedico: formValue.idmedico,
      idpaciente: formValue.idpaciente,
      productos: formValue.productos.map((p: any) => ({
        id_productos: p.id_productos,
        cantidad: p.cantidad
      }))
    };

    console.log('📤 Enviando receta:', recetaPayload);

    this.recetaService.guardarReceta(recetaPayload).subscribe({
      next: (res) => {
        console.log('✅ Receta guardada correctamente', res);
        alert('Receta guardada correctamente.');
        this.recetaForm.reset();
        this.productos.clear();
      },
      error: (err) => {
        console.error('❌ Error al guardar receta:', err);
        alert('Error al guardar receta');
      }
    });
  }

  onSeleccionarProducto(id: any): void {
    const idNum = Number(id);
    const producto = this.productosDisponibles.find(p => p.idproductos === idNum);
    if (producto) {
      this.agregarProducto(producto);
      this.productosFiltrados = [];
      this.busquedaProducto = '';
    }
  }

}
