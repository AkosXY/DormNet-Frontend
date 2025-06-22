import { TestBed } from '@angular/core/testing';

import { ResourceService } from './resource.service';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';

describe('ResourceService', () => {
  let service: ResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[provideHttpClientTesting(), provideHttpClient(),ResourceService]
    });
    service = TestBed.inject(ResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
