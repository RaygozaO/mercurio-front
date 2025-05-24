import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    canActivate: [RoleGuard],
    data: { roles: [1, 2] },
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
    children: [
      {
        path: 'ventas',
        loadComponent: () => import('./ventas/ventas.component').then(m => m.VentasComponent),
        data: { roles: [1, 2] }
      },
      {
        path: 'citas',
        loadComponent: () => import('./citas/calendario-citas/calendario-citas.component').then(m => m.CalendarioCitasComponent),
        data: { roles: [1, 2, 5, 6] } // acceso admin (1), admin2 (2), medico (5)
      },
      {
        path: 'inventario',
        loadComponent: () => import('./inventario/inventario.component').then(m => m.InventarioComponent),
        data: { roles: [1, 2] },
        children: [
          {
            path: '',
            loadComponent: () => import('./inventario/listar-producto/listarProducto.component').then(m => m.ListarProductoComponent),
            data: { roles: [1, 2] }
          },
          {
            path: 'crear',
            loadComponent: () => import('./inventario/crear-producto/crearProducto.component').then(m => m.CrearProductoComponent),
            data: { roles: [1, 2] }
          },
          {
            path: 'editar/:id',
            loadComponent: () => import('./inventario/editar-producto/editarProducto.component').then(m => m.EditarProductoComponent),
            data: { roles: [1, 2] }
          },
          {
            path: 'detalle/:id',
            loadComponent: () => import('./inventario/detalle-producto/detalleProducto.component').then(m => m.DetalleProductoComponent),
            data: { roles: [1, 2] }
          },
          {
            path: 'faltantes',
            loadComponent: () => import('./inventario/faltantes-producto/faltantesProducto.component').then(m => m.FaltantesProductoComponent),
            data: { roles: [1, 2] }
          },
        ]
      },
      {
        path: 'crear-cliente',
        loadComponent: () => import('./pacientes/pacientes.component').then(m => m.PacientesComponent),
        data: { roles: [1] }
      },
      {
        path: 'historial',
        loadComponent: () => import('./historial/historial.component').then(m => m.HistorialComponent),
        data: { roles: [1, 2] }
      },
      {
        path: 'reservas',
        loadComponent: () => import('./reservas/reservas.component').then(m => m.ReservasComponent),
        data: { roles: [1, 2, 3] }
      },
      {
        path: 'recetas',
        loadComponent: () => import('./recetas/recetas.component').then(m => m.RecetasComponent),
        data: { roles: [1, 2, 5] }
      },
      {
        path: 'referencia',
        loadComponent: () => import('./referencia/referencia.component').then(m => m.ReferenciaComponent),
        data: { roles: [1, 2, 5] } // ajusta según los roles que deban ver el módulo
      }

    ]
  },
  {
    path: 'pacientes',
    canActivate: [RoleGuard],
    data: { roles: [3] },
    loadComponent: () => import('./pacientes/pacientes.component').then(m => m.PacientesComponent)
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
