import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AlertaService } from '../services/alerta.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private router = inject(Router);
  private alerta = inject(AlertaService);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (typeof window === 'undefined') {
      console.warn('🌐 SSR detectado, denegando acceso');
      return false;
    }

    const expectedRoles: number[] = route.data['roles'] || [];
    const storedRole = localStorage.getItem('role');
    const userRole = storedRole ? parseInt(storedRole, 10) : null;


    if (userRole !== null && expectedRoles.includes(userRole)) {
      return true;
    }

    this.alerta.warning('Acceso denegado: no tienes permisos para esta sección');
    this.router.navigate(['/login']);
    return false;
  }
}
