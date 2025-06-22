import { TestBed } from '@angular/core/testing';

import { ReservationService } from './reservation.service';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';

describe('ReservationService', () => {
  let service: ReservationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[provideHttpClientTesting(), provideHttpClient(),ReservationService]
    });
    service = TestBed.inject(ReservationService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
