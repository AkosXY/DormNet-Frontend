import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AccommodationComponent } from './components/accommodation/accommodation.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { SportComponent } from './components/sport/sport.component';
import { ResourceComponent } from './components/resource/resource.component';
import { ResidentComponent } from './components/resident/resident.component';
import { AdminRoleGuard } from './guards/AdminRoleGuard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'accommodations', component: AccommodationComponent },
  { path: 'residents', component: ResidentComponent },
  { path: 'resources', component: ResourceComponent },
  {
    path: 'reservations',
    component: ReservationComponent,
    canActivate: [AdminRoleGuard],
  },
  { path: 'sports', component: SportComponent },
];
