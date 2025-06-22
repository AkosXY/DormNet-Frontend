import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentComponent } from './resident.component';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {of} from 'rxjs';
import {AccommodationService} from '../../services/api/accommodation.service';
import {MatDialog} from '@angular/material/dialog';
import Keycloak from 'keycloak-js';
import {CreateResidentDialogComponent} from './create-resident-dialog/create-resident-dialog.component';

jest.mock('keycloak-js', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));

const accommodationServiceMock = {
  getAllResidents: jest.fn().mockReturnValue(of([])), // or whatever shape you need
};

const dialogMock = {
  open: jest.fn().mockReturnValue({
    afterClosed: () => of(),
  }),
};

const keycloakMock = {
  loadUserInfo: jest.fn(),
  hasRealmRole: jest.fn().mockReturnValue(true),
};



describe('ResidentComponent', () => {
  let component: ResidentComponent;
  let fixture: ComponentFixture<ResidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentComponent],
      providers : [
        { provide: AccommodationService, useValue: accommodationServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: Keycloak, useValue: keycloakMock },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('applyFilter', () => {
    beforeEach(() => { component.dataSource = { filter: '' }; });

    it('sets dataSource.filter to trimmed/lowercase value', () => {
      component.applyFilter('  HeLLo  ');
      expect(component.dataSource.filter).toBe('hello');
    });

  });

  describe('onCreate', () => {
    it('calls dialog.open with correct args', () => {
      dialogMock.open.mockReturnValue({ afterClosed: () => of('not-refresh') });
      component.onCreate();
      expect(dialogMock.open).toHaveBeenCalledWith(
        CreateResidentDialogComponent,
        { autoFocus: false }
      );
    });

    it('calls initTable if dialog result is "refresh"', () => {
      dialogMock.open.mockReturnValue({ afterClosed: () => of('refresh') });
      const spy = jest.spyOn(component, 'initTable');
      component.onCreate();
      expect(spy).toHaveBeenCalled();
    });

    it('does NOT call initTable if dialog result is not "refresh"', () => {
      dialogMock.open.mockReturnValue({ afterClosed: () => of('not-refresh') });
      const spy = jest.spyOn(component, 'initTable');
      component.onCreate();
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
