import { TestBed } from '@angular/core/testing';

import { SportService } from './sport.service';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';

describe('SportService', () => {
  let service: SportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[provideHttpClientTesting(), provideHttpClient(),SportService]
    });
    service = TestBed.inject(SportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
