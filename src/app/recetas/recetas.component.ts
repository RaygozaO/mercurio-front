import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { ProductoService } from '../ventas/producto.services';
import {NgForOf, NgIf} from '@angular/common';
import { CitasService } from '../citas/citas.service';
import { PacienteService } from '../services/paciente.services';
import { RecetaService } from '../services/receta.services';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoBase64 from '../../assets/base64/logo_base64';
import { QRCode } from 'qrcode';


interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY?: number;
  };
}


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
export class RecetasComponent implements OnInit {
  recetaForm!: FormGroup;
  productosDisponibles: any[] = [];
  doctores: any[] = [];
  searchTerm = '';
  resultadosBusqueda: any[] = [];
  busquedaProducto = '';
  productosFiltrados: any[] = [];
  listaPacientes: any[] = [];
  listaMedicos: any[] = [];
  pacienteActual: any = null;
  medicoActual: any = null;
  medicamentos: any[] = [];


  constructor(
    private fb: FormBuilder,
    private productosService: ProductoService,
    private citas: CitasService,
    private pacienteService: PacienteService,
    private recetaService: RecetaService,
  ) {
  }

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
      console.log('Doctores cargados: ', data);
      this.doctores = data;
    });
  }

  seleccionarMedico(event: any): void {
    const idMedicoSeleccionado = +event.target.value;
    console.log('🔎 ID seleccionado:', idMedicoSeleccionado);
    console.log('🧾 Doctores disponibles:', this.doctores);

    const medicoEncontrado = this.doctores.find(m => m.idmedico === idMedicoSeleccionado);

    this.medicoActual = {
      nombreusuario: medicoEncontrado?.nombrecliente || 'N/A',
      cedula: medicoEncontrado?.cedula || 'N/A'
    };

    console.log('👨‍⚕️ Médico seleccionado:', this.medicoActual);
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
    this.pacienteActual = paciente; // ✅ ← Aquí guardamos al paciente actual
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

  imprimirReceta() {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    const pageWidth = doc.internal.pageSize.getWidth();
    const receta = this.recetaForm.value;
    const fechaActual = new Date().toLocaleDateString();

    const paciente = this.pacienteActual || {nombrecliente: 'N/A'};
    const medico = this.medicoActual || {nombreusuario: 'N/A', cedula: 'N/A'};

    // Logo
    doc.addImage(logoBase64, 'PNG', 160, 10, 20, 20);

    // Encabezado
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('RECETA MÉDICA', pageWidth / 2, 20, {align: 'center'});
    doc.setLineWidth(0.5);
    doc.line(20, 30, pageWidth - 20, 30);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${fechaActual}`, 150, 45);

    // Paciente
    doc.setFont('helvetica', 'bold');
    doc.text('Paciente:', 20, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(paciente.nombrecliente, 50, 55);

    // Médico
    doc.setFont('helvetica', 'bold');
    doc.text('Médico:', 20, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(medico.nombreusuario, 50, 65);

    // Cédula
    doc.setFont('helvetica', 'bold');
    doc.text('Cédula:', 20, 75);
    doc.setFont('helvetica', 'normal');
    doc.text(medico.cedula, 50, 75);

    // Resumen clínico
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen clínico:', 20, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(receta.resumenclinico || 'N/A', 20, 93, {maxWidth: 170});

    const medicamentos: { nombre: string }[] = (receta.productos || []).map((p: any) => ({
      nombre: p.nombre || 'Sin nombre'
    }));

    let afterTableY = 110;
    if (medicamentos.length > 0) {
      autoTable(doc, {
        startY: afterTableY,
        head: [['Medicamento']],
        body: medicamentos.map(m => [m.nombre])
      });

      const lastTable = (doc as any).lastAutoTable;
      afterTableY = lastTable?.finalY || afterTableY + 20;
    }


    // Indicaciones
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Indicaciones:', 20, afterTableY + 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(receta.indicaciones || 'N/A', 20, afterTableY + 18, {maxWidth: 170});

    // Firma
    doc.setLineWidth(0.2);
    doc.line(20, 250, 100, 250);
    doc.text('Firma del médico', 20, 255);

    // Dirección dividida
    doc.setFontSize(10);
    doc.text('Benito Juárez Mza. 130 lote 8, Col. Miguel Hidalgo,', 20, 265);
    doc.text('C.P. 55490, Ecatepec, Edo. de México', 20, 272);
    // QR
    const qrTexto = `Receta para ${paciente.nombrecliente} - ${fechaActual}`;
    import('qrcode').then(QRCode => {
      QRCode.toDataURL(qrTexto, {width: 100}, (err, qrBase64) => {
        if (!err && qrBase64) {
          doc.addImage(qrBase64, 'PNG', pageWidth - 50, 250, 30, 30);
        } else {
          console.error('Error generando QR', err);
        }
        doc.save(`receta_${fechaActual.replace(/\//g, '-')}.pdf`);
      });
    });
  }
}
