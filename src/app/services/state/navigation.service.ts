import { effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '../../model/route';
import Keycloak from 'keycloak-js';
import { ResponsiveService } from '../display/responsive.service';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private collapsed = signal(false);

  private routes: Route[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: 'home',
      description: 'Get quick insights and manage your overview.',
      showOnHomepage: false,
    },
    {
      label: 'Rooms',
      icon: 'hotel',
      route: 'accommodations',
      description: 'Assign residents to rooms and manage accommodations.',
      showOnHomepage: true,
    },
    {
      label: 'Residents',
      icon: 'group',
      route: 'residents',
      description: 'Add, view, and manage resident profiles and information.',
      showOnHomepage: true,
    },
    {
      label: 'Resources',
      icon: 'local_laundry_service',
      route: 'resources',
      description:
        'Access shared facilities, documents, and reservations.',
      showOnHomepage: true,
    },
    {
      label: 'Reservations',
      icon: 'event',
      route: 'reservations',
      description: 'Track and manage reservations for shared resources.',
      showOnHomepage: false,
      roles: ['admin'],
    },
    {
      label: 'Sports',
      icon: 'sports_soccer',
      route: 'sports',
      description:
        'Sign up for dorm tournaments and exciting sports activities.',
      showOnHomepage: true,
    },
  ];

  private router: Router = inject(Router);
  private keycloak: Keycloak = inject(Keycloak);
  private responsiveService: ResponsiveService = inject(ResponsiveService);

  isCollapsed = this.collapsed.asReadonly();

  constructor() {
    effect(() => {
      if (this.responsiveService.smallWidth()) {
        this.collapsed.set(true);
      }
    });
  }

  toggle() {
    if (!this.responsiveService.smallWidth()) {
      this.collapsed.set(!this.collapsed());
    }
  }

  public getRoutes(): Route[] {
    return this.routes.filter((route) => {
      if (!route.roles) return true;
      return route.roles.some((role) => this.keycloak.hasRealmRole(role));
    });
  }

  getFilteredRoutes(): Route[] {
    return this.getRoutes().filter((route) => route.showOnHomepage !== false);
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }
}
