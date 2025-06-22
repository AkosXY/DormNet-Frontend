import {ComponentFixture, fakeAsync, flushMicrotasks, TestBed, tick} from '@angular/core/testing';

import { ResidentDetailDialogComponent } from './resident-detail-dialog.component';
import {of} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import { HasRoleStubDirective } from '../../../directives/has-role-stub.directive';
import {TemplateRef, ViewContainerRef} from '@angular/core';
import Keycloak from 'keycloak-js';
import {AccommodationService} from '../../../services/api/accommodation.service';

jest.mock('keycloak-js', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));

const dialogMock = {
  open: jest.fn().mockReturnValue({
    afterClosed: () => of(),
  }),
};

const dialogRefMock = {
  close: jest.fn(),
};


const keycloakMock = { hasRealmRole: jest.fn(() => true) };
const viewContainerRefMock = { createEmbeddedView: jest.fn(), clear: jest.fn() };
const templateRefMock = {};

let accommodationServiceMock: { unassignResident: jest.Mock };
const mockResident = { id: 42, name: 'Test Resident' } as any;
const mockRoom = { id: 12, number: 'A-1' } as any;
const mockData = { resident: mockResident, room: mockRoom };


describe('ResidentDetailDialogComponent', () => {
  let component: ResidentDetailDialogComponent;
  let fixture: ComponentFixture<ResidentDetailDialogComponent>;

  beforeEach(async () => {
    accommodationServiceMock = { unassignResident: jest.fn().mockReturnValue(of(null)) };

    await TestBed.configureTestingModule({
      imports: [ResidentDetailDialogComponent, HasRoleStubDirective],
      providers: [
        { provide: MatDialog, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: Keycloak, useValue: keycloakMock },
      ]
    })
      .overrideComponent(ResidentDetailDialogComponent, {
        set: {
          providers: [
            { provide: AccommodationService, useValue: accommodationServiceMock },
            { provide: MatDialogRef, useValue: dialogRefMock },
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(ResidentDetailDialogComponent);
    component = fixture.componentInstance;
    jest.clearAllMocks();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should unassign resident and close dialog with result', fakeAsync(() => {
    component.unassignResident();
    flushMicrotasks();
    expect(accommodationServiceMock.unassignResident).toHaveBeenCalledWith(mockResident.id);
    expect(dialogRefMock.close).toHaveBeenCalledWith('unassigned');
  }));

});
