import { TestBed } from '@angular/core/testing';

import { NavigationService } from './navigation.service';
import {Router} from '@angular/router';
import Keycloak from 'keycloak-js';
import {ResponsiveService} from '../display/responsive.service';

jest.mock('keycloak-js', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));

const routerMock = { navigate: jest.fn() };
const keycloakMock = { hasRealmRole: jest.fn().mockReturnValue(true) };
const responsiveServiceMock = { smallWidth: jest.fn().mockReturnValue(false) };


describe('NavigationService', () => {
  let service: NavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        { provide: Router, useValue: routerMock },
        { provide: Keycloak, useValue: keycloakMock },
        { provide: ResponsiveService, useValue: responsiveServiceMock },
      ]
    });
    service = TestBed.inject(NavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });



  describe('toggle', () => {
    it('should toggle the collapsed signal if not smallWidth', () => {
      expect(service.isCollapsed()).toBe(false);
      service.toggle();
      expect(service.isCollapsed()).toBe(true);
      service.toggle();
      expect(service.isCollapsed()).toBe(false);
    });

    it('should not toggle collapsed if smallWidth returns true', () => {
      responsiveServiceMock.smallWidth.mockReturnValue(true);
      if (!service.isCollapsed()) service.toggle();
      const current = service.isCollapsed();
      service.toggle();
      expect(service.isCollapsed()).toBe(current);
    });
  });

  describe('navigateToHome', () => {
    it('should call router.navigate with /home', () => {
      service.navigateToHome();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

})
