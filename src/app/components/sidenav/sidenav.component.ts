import { Component, signal } from '@angular/core';
import { SidenavService } from '../../services/state/sidenav.service';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import { MatListModule, MatNavList } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NgForOf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidenav',
  imports: [
    MatNavList,
    MatListModule,
    MatIconModule,
    NgForOf,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  menuItems = signal<MenuItem[]>([
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: 'home',
    },
    {
      label: 'Accommodations',
      icon: 'hotel',
      route: 'accommodations',
    },
    {
      label: 'Resources',
      icon: 'local_laundry_service',
      route: 'resources',
    },
    {
      label: 'Reservations',
      icon: 'event',
      route: 'reservations',
    },
    {
      label: 'Sports',
      icon: 'sports_soccer',
      route: 'sports',
    },
  ]);

  constructor(private sidenavService: SidenavService) {}
}
