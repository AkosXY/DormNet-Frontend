  import { HasRoleDirective } from './has-role.directive';
  import {ComponentFixture, TestBed} from '@angular/core/testing';
  import Keycloak from 'keycloak-js';
  import {Component} from '@angular/core';

  jest.mock('keycloak-js', () => ({
    __esModule: true,
    default: jest.fn(() => ({})),
  }));
  const keycloakMock = { hasRealmRole: jest.fn() };

  @Component({
    standalone: true,
    imports: [HasRoleDirective],
    template: `<div *hasRole="role">Content</div>`
  })
  class HostComponent {
    role: string|string[] = 'admin';
  }

  describe('HasRoleDirective', () => {
    let fixture: ComponentFixture<HostComponent>;

    beforeEach(() => {
      jest.clearAllMocks();
      TestBed.configureTestingModule({
        imports: [HostComponent],
        providers: [{ provide: Keycloak, useValue: keycloakMock }]
      });
    });

    it('should render content if user has role', () => {
      keycloakMock.hasRealmRole.mockReturnValue(true);
      fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Content');
    });

    it('should NOT render content if user lacks role', () => {
      keycloakMock.hasRealmRole.mockReturnValue(false);
      fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).not.toContain('Content');
    });

    it('should support multiple roles: passes if has any', () => {
      keycloakMock.hasRealmRole.mockImplementation((role) => role === 'bar');
      fixture = TestBed.createComponent(HostComponent);
      fixture.componentInstance.role = ['foo', 'bar'];
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Content');
    });
  });
