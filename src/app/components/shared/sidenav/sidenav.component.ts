import { Component, OnInit, signal } from '@angular/core';
import { NavigationService } from '../../../services/state/navigation.service';
import { MatListModule, MatNavList } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

import { RouterLink, RouterLinkActive } from '@angular/router';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  description: string;
}

@Component({
  selector: 'app-sidenav',
  imports: [
    MatNavList,
    MatListModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit {
  menuItems: any;

  constructor(private navigationService: NavigationService) {}

  ngOnInit() {
    this.menuItems = signal<MenuItem[]>(this.navigationService.getRoutes());
  }
}
