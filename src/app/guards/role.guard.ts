import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (typeof window === 'undefined') {
      console.warn('🌐 SSR detectado, denegando acceso');
      return false;
    }

    const expectedRoles: number[] = route.data['roles'] || [];
    const storedRole = localStorage.getItem('role');
    const userRole = storedRole ? parseInt(storedRole, 10) : null;

    console.log('🔐 RoleGuard: esperado', expectedRoles, '→ actual', userRole);

    if (userRole !== null && expectedRoles.includes(userRole)) {
      return true;
    }

    console.warn('⛔ Acceso denegado por rol');
    this.router.navigate(['/login']);
    return false;
  }
}
