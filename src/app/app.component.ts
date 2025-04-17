import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { NavigationService } from './services/state/navigation.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SidenavComponent } from './components/shared/sidenav/sidenav.component';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatRippleModule } from '@angular/material/core';
import {
  animate,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidenavComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatRippleModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('routeAnimation', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
            }),
          ],
          { optional: true },
        ),

        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            animate(
              '200ms ease-in',
              style({ opacity: 1, transform: 'translateY(0)' }),
            ),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  navigationService: NavigationService = inject(NavigationService);
  title = 'dormnet-frontend';

  collapsed!: Signal<boolean>;
  width!: Signal<string>;

  constructor(
    protected sidenavService: NavigationService,
    protected route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.collapsed = this.sidenavService.isCollapsed;

    this.width = computed(() => (this.collapsed() ? '60px' : '250px'));
  }

  navigateToHome(): void {
    this.navigationService.navigateToHome();
  }
}
