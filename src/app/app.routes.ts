import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import {AccommodationComponent} from './components/accommodation/accommodation.component';
import {ReservationComponent} from './components/reservation/reservation.component';
import {SportComponent} from './components/sport/sport.component';
import {ResourceComponent} from './components/resource/resource.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'accommodations', component: AccommodationComponent },
  { path: 'resources', component: ResourceComponent },
  { path: 'reservations', component: ReservationComponent },
  { path: 'sports', component: SportComponent },
];
