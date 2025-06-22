import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportComponent } from './sport.component';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';
import {SportService} from '../../services/api/sport.service';
import {MatDialog} from '@angular/material/dialog';
import {of} from 'rxjs';
import Keycloak from 'keycloak-js';

jest.mock('keycloak-js', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));

const keycloakMock = {
  hasRealmRole: jest.fn().mockReturnValue(true)
};

const matDialogMock = {
  open: jest.fn()
};

const sportServiceMock = {
  getAllSportEvents: jest.fn().mockReturnValue(of([])),
  createSportEvent: jest.fn(),
  addEntryToSportEvent: jest.fn(),
  deleteSportEvent: jest.fn(),
  deleteEntryFromSportEvent: jest.fn(),
};

describe('SportComponent', () => {
  let component: SportComponent;
  let fixture: ComponentFixture<SportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportComponent],
      providers:[provideHttpClientTesting(), provideHttpClient(),SportService,
        { provide: SportService, useValue: sportServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: Keycloak, useValue: keycloakMock },]

    })
    .compileComponents();

    fixture = TestBed.createComponent(SportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and call necessary methods on ngOnInit', () => {
    const spyLoad = jest.spyOn(component, 'loadSportEvents');
    const spyDebounce = jest.spyOn(component, 'initDebounce');
    const spyColumns = jest.spyOn<any, any>(component as any, 'initDisplayedColums');
    component.ngOnInit();
    expect(spyLoad).toHaveBeenCalled();
    expect(spyDebounce).toHaveBeenCalled();
    expect(spyColumns).toHaveBeenCalled();
  });

  it('should handle getAllSportEvents error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (sportServiceMock.getAllSportEvents as jest.Mock).mockReturnValueOnce({ subscribe: (s: any, err: any) => err('fail') });
    component.loadSportEvents();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should apply filter and reset pagination', () => {
    component.allSportEvents = [
      { name: 'Football', id: 1 },
      { name: 'Basketball', id: 2 },
    ];
    component.applyFilter('foot');
    expect(component.sportEvents.length).toBe(1);
    expect(component.pageIndex).toBe(0);
  });

  it('should show all if filter is empty', () => {
    component.allSportEvents = [{ name: 'A', id: 1 }, { name: 'B', id: 2 }];
    component.applyFilter('');
    expect(component.sportEvents.length).toBe(2);
  });

  it('should apply pagination', () => {
    component.sportEvents = [{}, {}, {}, {}, {}, {}] as any;
    component.pageIndex = 0;
    component.pageSize = 2;
    component.applyPagination();
    expect(component.pagedSportEvents.length).toBe(2);
    component.pageIndex = 2;
    component.applyPagination();
    expect(component.pagedSportEvents.length).toBe(2);
  });

  it('should change page on onPageChange', () => {
    component.onPageChange({ pageIndex: 1, pageSize: 1 } as any);
    expect(component.pageIndex).toBe(1);
    expect(component.pageSize).toBe(1);
  });

  it('should open AddSportEntryDialogComponent and refresh on result === "refresh"', () => {
    const afterClosed = of("refresh");
    matDialogMock.open.mockReturnValue({ afterClosed: () => afterClosed });
    const spy = jest.spyOn(component, 'loadSportEvents');
    component.selectEvent({ name: 'e' });
    expect(matDialogMock.open).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it('should not refresh on AddEntryDialog closed with no refresh', () => {
    matDialogMock.open.mockReturnValue({ afterClosed: () => of("nope") });
    const spy = jest.spyOn(component, 'loadSportEvents');
    component.selectEvent({ name: 'e' });
    expect(spy).not.toHaveBeenCalled();
  });

  it('should open CreateSportEventDialogComponent and refresh on "refresh"', () => {
    matDialogMock.open.mockReturnValue({ afterClosed: () => of("refresh") });
    const spy = jest.spyOn(component, 'loadSportEvents');
    component.onCreate();
    expect(matDialogMock.open).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it('should not refresh on CreateSportEventDialog closed without refresh', () => {
    matDialogMock.open.mockReturnValue({ afterClosed: () => of("no") });
    const spy = jest.spyOn(component, 'loadSportEvents');
    component.onCreate();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call deleteSportEvent if confirmed', () => {
    matDialogMock.open.mockReturnValue({ afterClosed: () => of(true) });
    (sportServiceMock.deleteSportEvent as jest.Mock).mockReturnValue(of({}));
    const spy = jest.spyOn(component, 'loadSportEvents');
    component.deleteEvent({ id: 1, name: 'ev' } as any);
    expect(matDialogMock.open).toHaveBeenCalled();
    expect(sportServiceMock.deleteSportEvent).toHaveBeenCalledWith(1);
    expect(spy).toHaveBeenCalled();
  });

  it('should log error if deleteSportEvent throws', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    matDialogMock.open.mockReturnValue({ afterClosed: () => of(true) });
    (sportServiceMock.deleteSportEvent as jest.Mock).mockReturnValue({ subscribe: (obj: any) => obj.error('xxx') });
    component.deleteEvent({ id: 1, name: 'ev' } as any);
    expect(errSpy).toHaveBeenCalled();
    errSpy.mockRestore();
  });

  it('should call deleteEntryFromSportEvent if confirmed', () => {
    matDialogMock.open.mockReturnValue({ afterClosed: () => of(true) });
    (sportServiceMock.deleteEntryFromSportEvent as jest.Mock).mockReturnValue(of({}));
    const spy = jest.spyOn(component, 'loadSportEvents');
    component.deleteEntry('1', { participantName: 'a' } as any);
    expect(matDialogMock.open).toHaveBeenCalled();
    expect(sportServiceMock.deleteEntryFromSportEvent).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });


  it('should log error if deleteEntryFromSportEvent throws', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    matDialogMock.open.mockReturnValue({ afterClosed: () => of(true) });
    (sportServiceMock.deleteEntryFromSportEvent as jest.Mock).mockReturnValue({ subscribe: (obj: any) => obj.error('xxx') });
    component.deleteEntry('1', { participantName: 'z' } as any);
    expect(errSpy).toHaveBeenCalled();
    errSpy.mockRestore();
  });

  it('should initialize displayedColumns with "actions" if admin', () => {
    keycloakMock.hasRealmRole.mockReturnValueOnce(true);
    component['initDisplayedColums']();
    expect(component.displayedColumns).toContain('actions');
  });

  it('should not add "actions" column if not admin', () => {
    keycloakMock.hasRealmRole.mockReturnValueOnce(false);
    component['initDisplayedColums']();
    expect(component.displayedColumns).not.toContain('actions');
  });

});
