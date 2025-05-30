import {Component, OnInit} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, RouterOutlet, FormsModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  terminoBusqueda = '';
  sugerencias: any[] = [];
  usuarioLogueado: string = '';

  opciones = [
    { nombre: 'recetas', icono: '📄', ruta: '/admin/recetas', categoria: 'Clínico' },
    { nombre: 'pacientes', icono: '🧑‍🤝‍🧑', ruta: '/admin/pacientes', categoria: 'Clínico' },
    { nombre: 'citas', icono: '📅', ruta: '/admin/citas', categoria: 'Clínico' },
    { nombre: 'referencias médicas', icono: '🔁', ruta: '/admin/referencia', categoria: 'Clínico' },

    { nombre: 'inventario', icono: '📦', ruta: '/admin/inventario', categoria: 'Administrativo' },
    { nombre: 'ventas', icono: '🛒', ruta: '/admin/ventas', categoria: 'Administrativo' },
    { nombre: 'compras', icono: '📥', ruta: '/admin/compras', categoria: 'Administrativo' },
    { nombre: 'clientes', icono: '🙋‍♂️', ruta: '/admin/clientes', categoria: 'Administrativo' },

    { nombre: 'usuarios', icono: '👤', ruta: '/admin/usuarios', categoria: 'Sistema' },
    { nombre: 'historial', icono: '🗂', ruta: '/admin/historial', categoria: 'Clínico' },
    { nombre: 'reservas', icono: '📆', ruta: '/admin/reservas', categoria: 'Clínico' },
    { nombre: 'reportes', icono: '📊', ruta: '/admin/reportes', categoria: 'Administrativo' },
    { nombre: 'configuración', icono: '⚙️', ruta: '/admin', categoria: 'Sistema' },
    { nombre: 'estadísticas', icono: '📈', ruta: '/admin', categoria: 'Administrativo' },
    { nombre: 'perfil', icono: '🙍', ruta: '/admin/personales', categoria: 'Sistema' },
    { nombre: 'inicio', icono: '🏠', ruta: '/admin', categoria: 'General' },
    { nombre: 'medico', icono: '😷', ruta: '/admin/recetas', categoria: 'Clínico' },
  ];


  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const idUsuario = localStorage.getItem('id_usuario');

    if (idUsuario) {
      this.authService.obtenerUsuarioPorId(+idUsuario).subscribe({
        next: (data) => {
          const nombreCompleto = `${data.nombre} ${data.apellidopaterno}`;
          let rol = 'Usuario';

          switch (data.rol) {
            case 'compras':
              rol = 'Compras';
              break;
            case 'ventas':
              rol = 'Ventas';
              break;
            case 'superadmin':
              rol = 'Super Admin';
              break;
            case 'medico':
              rol = 'Médico';
              break;
            case 'paciente':
              rol = 'Paciente';
              break;
            case 'admin':
              rol = 'Administrador';
              break;
          }

          this.usuarioLogueado = `${nombreCompleto} (${rol})`;
        },
        error: (err) => {
          console.error('Error al obtener el usuario:', err);
          this.usuarioLogueado = 'Usuario desconocido';
        }
      });
    }
  }

  filtrarSugerencias() {
    const termino = this.terminoBusqueda.toLowerCase().trim();
    this.sugerencias = termino
      ? this.opciones.filter(op => op.nombre.includes(termino))
      : [];
  }


  seleccionarSugerencia(sugerencia: any) {
    this.terminoBusqueda = sugerencia.nombre;
    this.sugerencias = [];
    this.router.navigate([sugerencia.ruta]);
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
  cerrarSesion(): void {
    // Elimina datos de sesión (ajusta según tus claves)
    localStorage.removeItem('token');
    localStorage.removeItem('nombreusuario');
    localStorage.removeItem('id_usuario'); // o cualquier otro valor que guardes

    // Redirige al login
    this.router.navigate(['/login']);
  }
}
