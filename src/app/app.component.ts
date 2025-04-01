import {Component, computed, OnInit, Signal, ViewEncapsulation} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SidenavService} from './services/state/sidenav.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {SidenavComponent} from './components/sidenav/sidenav.component';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {NgClass} from '@angular/common';
import {MatRippleModule} from '@angular/material/core';

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
    NgClass,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

})



export class AppComponent implements OnInit {
  title = 'dormnet-frontend';
  collapsed!: Signal<boolean>;
  width!: Signal<string>;

  constructor(protected sidenavService: SidenavService) {
  }

  ngOnInit() {
    this.collapsed = this.sidenavService.isCollapsed;

    this.width = computed(() => (this.collapsed() ? '60px' : '250px'));
  }
}
