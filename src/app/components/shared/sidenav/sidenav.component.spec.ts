import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';
import {NavigationService} from '../../../services/state/navigation.service';
import Keycloak from 'keycloak-js';
import {ResponsiveService} from '../../../services/display/responsive.service';
import {RouterTestingModule} from '@angular/router/testing';

jest.mock('keycloak-js', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));

const keycloakMock = { hasRealmRole: jest.fn().mockReturnValue(true) };
const responsiveServiceMock = { smallWidth: jest.fn().mockReturnValue(false) };


describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, SidenavComponent,
        ],
      providers: [
        NavigationService,
        { provide: Keycloak, useValue: keycloakMock },
        { provide: ResponsiveService, useValue: responsiveServiceMock },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
