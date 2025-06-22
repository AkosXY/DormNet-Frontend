import { TestBed } from '@angular/core/testing';

import { AccommodationService } from './accommodation.service';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';

describe('AccommodationService', () => {
  let service: AccommodationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[provideHttpClientTesting(), provideHttpClient(),AccommodationService]
    });
    service = TestBed.inject(AccommodationService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
