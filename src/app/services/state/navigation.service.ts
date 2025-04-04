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
    },
    {
      label: 'Rooms',
      icon: 'hotel',
      route: 'accommodations',
      description: 'Find and book your perfect stay.',
    },
    {
      label: 'Resources',
      icon: 'local_laundry_service',
      route: 'resources',
      description: 'Access guides, documents, and more.',
    },
    {
      label: 'Reservations',
      icon: 'event',
      route: 'reservations',
      description: 'Manage your upcoming bookings easily.',
    },
    {
      label: 'Sports',
      icon: 'sports_soccer',
      route: 'sports',
      description: 'Join exciting sports events and activities.',
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

    return currentRoute === 'home'
      ? this.routes.filter((route) => route.route !== 'home')
      : this.routes;
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }
}
