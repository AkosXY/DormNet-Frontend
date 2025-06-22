import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import {NavigationService} from '../../services/state/navigation.service';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {ReservationService} from '../../services/api/reservation.service';
import {ResponsiveService} from '../../services/display/responsive.service';
import {MatDialog} from '@angular/material/dialog';

jest.mock('keycloak-js', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));


const navigationServiceMock = {
  getRoutes: jest.fn().mockReturnValue([]),
  getFilteredRoutes: jest.fn().mockReturnValue([]),
  navigateToHome: jest.fn(),
};

const activatedRouteMock = {
  params: of({}),
  queryParams: of({}),
  fragment: of(''),
  data: of({}),
  outlet: 'primary',
  snapshot: {},
  url: of([])
};

const routerMock = {
  navigate: jest.fn(),
  events: of([]),
  createUrlTree: jest.fn(() => ({})),
  serializeUrl: jest.fn(() => ({})),
}


const reservationServiceMock = {
  getMyActiveReservations: jest.fn().mockReturnValue(of([{ id: 1, foo: 'bar' }])),
  dropReservation: jest.fn().mockReturnValue(of({}))
};

const responsiveServiceMock = {
  largeWidth: jest.fn().mockReturnValue(true),
  mediumWidth: jest.fn().mockReturnValue(false),
  smallWidth: jest.fn().mockReturnValue(false)
};

const afterClosedMock = jest.fn();
const dialogRefStub = {
  afterClosed: afterClosedMock
};

const matDialogMock = {
  open: jest.fn()
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: NavigationService, useValue: navigationServiceMock },
        { provide: ReservationService, useValue: reservationServiceMock },
        { provide: ResponsiveService, useValue: responsiveServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('getReservations should update reservations', () => {
    component.reservations = [];
    component.getReservations();
    expect(reservationServiceMock.getMyActiveReservations).toHaveBeenCalled();
    expect(component.reservations).toEqual([{ id: 1, foo: 'bar' }]);
  });

  it('shouldShowFeatureCards should return true if not small width', () => {
    responsiveServiceMock.smallWidth.mockReturnValue(false);
    expect(component.shouldShowFeatureCards()).toBe(true);
  });

  it('shouldShowFeatureCards should return false if small width', () => {
    responsiveServiceMock.smallWidth.mockReturnValue(true);
    expect(component.shouldShowFeatureCards()).toBe(false);
  });

  it('should return 4 columns when largeWidth is true', () => {
    responsiveServiceMock.largeWidth.mockReturnValue(true);
    responsiveServiceMock.mediumWidth.mockReturnValue(false);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    expect(component.columnSelector()).toBe('repeat(4, 1fr)');
  });

  it('should return 2 columns when mediumWidth is true', () => {
    responsiveServiceMock.largeWidth.mockReturnValue(false);
    responsiveServiceMock.mediumWidth.mockReturnValue(true);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    expect(component.columnSelector()).toBe('repeat(2, 1fr)');
  });

  it('onDelete should call dialog and drop reservation if confirmed', () => {
    matDialogMock.open.mockReturnValue(dialogRefStub);
    afterClosedMock.mockReturnValue(of(true));
    const dropSpy = jest.spyOn(reservationServiceMock, 'dropReservation');
    const getReservationsSpy = jest.spyOn(component, 'getReservations');

    component.onDelete({ id: 123 } as any);

    expect(matDialogMock.open).toHaveBeenCalled();
    expect(dropSpy).toHaveBeenCalledWith(123);
    expect(getReservationsSpy).toHaveBeenCalled();
  });

  it('onDelete should log error if dropReservation fails', () => {
    matDialogMock.open.mockReturnValue(dialogRefStub);
    afterClosedMock.mockReturnValue(of(true));
    reservationServiceMock.dropReservation.mockReturnValueOnce(throwError(() => new Error('fail')));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    component.onDelete({ id: 888 } as any);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to cancel reservation', expect.any(Error));
    consoleErrorSpy.mockRestore();
  });
});
