import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import Keycloak from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class AdminRoleGuard implements CanActivate {
  private readonly keycloak: Keycloak = inject(Keycloak);
  private router: Router = inject(Router);

  canActivate(): boolean {
    if (this.keycloak.hasRealmRole('admin')) {
      return true;
    }

    this.router.navigate(['/home']);
    return false;
  }
}
