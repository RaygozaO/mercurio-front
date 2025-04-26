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
    data: { roles: [1,2] }, // solo admin
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
    children: [
      {
        path: 'ventas',
        loadComponent: () => import('./ventas/ventas.component').then(m => m.VentasComponent),
        canActivate: [RoleGuard],
        data: { roles: [1, 2] } // admin y vendedor
      },
      {
        path: 'inventario',
        loadComponent: () => import('./inventario/inventario.component').then(m => m.InventarioComponent),
        canActivate: [RoleGuard],
        data: { roles: [1, 2] }
      },
      {
        path: 'crear-cliente',
        loadComponent: () => import('./pacientes/pacientes.component').then(m => m.PacientesComponent),
        canActivate: [RoleGuard],
        data: { roles: [1] }
      },
      {
        path: 'historial',
        loadComponent: () => import('./historial/historial.component').then(m => m.HistorialComponent),
        canActivate: [RoleGuard],
        data: { roles: [1, 2] }
      },
      {
        path: 'reservas',
        loadComponent: () => import('./reservas/reservas.component').then(m => m.ReservasComponent),
        canActivate: [RoleGuard],
        data: { roles: [1, 2, 3] }
      },
      {
        path: 'recetas',
        loadComponent: () => import('./recetas/recetas.component').then(m => m.RecetasComponent),
        canActivate: [RoleGuard],
        data: { roles: [1, 2, 3] }
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
