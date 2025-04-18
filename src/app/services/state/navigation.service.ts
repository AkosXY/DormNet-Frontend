import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '../../model/route';

@Injectable({
  providedIn: 'root',
})
@Injectable({ providedIn: 'root' })
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
        'Access shared facilities, documents, and reservation options.',
      showOnHomepage: true,
    },
    {
      label: 'Reservations',
      icon: 'event',
      route: 'reservations',
      description: 'Track and manage reservations for shared resources.',
      showOnHomepage: false,
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

  constructor(private router: Router) {}

  isCollapsed = this.collapsed.asReadonly();

  toggle() {
    this.collapsed.set(!this.collapsed());
  }

  public getRoutes() {
    return this.routes;
  }

  getFilteredRoutes(): Route[] {
    const currentRoute = this.router.url.split('/')[1];

    return this.routes.filter((route) => route.showOnHomepage !== false);
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }
}
