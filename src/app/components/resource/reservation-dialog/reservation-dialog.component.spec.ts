import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReservationDialogComponent } from './reservation-dialog.component';
import { ReservationService } from '../../../services/api/reservation.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { Resource } from '../../../model/resource';
import {provideNativeDateAdapter} from '@angular/material/core';

const mockDialogRef = { close: jest.fn() };
const mockResource: Resource = { id: 42, name: 'My Resource' } as Resource;
const reservationServiceMock = {
  getAvailableTimeSlots: jest.fn(),
  placeReservation: jest.fn()
};

describe('ReservationDialogComponent', () => {
  let component: ReservationDialogComponent;
  let fixture: ComponentFixture<ReservationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockResource },
        { provide: ReservationService, useValue: reservationServiceMock },
        provideNativeDateAdapter()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationDialogComponent);
    component = fixture.componentInstance;
    jest.clearAllMocks();
  });

  it('should access reservationDate and duration getters', () => {
    expect(component.reservationDate).toBe(component.reservationForm.get('reservationDate'));
    expect(component.duration).toBe(component.reservationForm.get('duration'));
  });

  describe('checkAvailability', () => {
    it('should hit all branches for checkAvailability', () => {
      // Arrange
      const stepperMock = { next: jest.fn() };
      const fakeDate = new Date('2023-12-23').toDateString();
      const fakeDuration = 55;
      component.reservationForm.setValue({ reservationDate: fakeDate, duration: fakeDuration });

      // a: slots found
      reservationServiceMock.getAvailableTimeSlots.mockReturnValueOnce(of(['12:00:00']));
      component.checkAvailability(stepperMock);
      expect(component.availableTimeSlots).toEqual(['12:00:00']);
      expect(component.isAvailable).toBe(true);
      expect(stepperMock.next).toHaveBeenCalled();

      // b: no slots found
      reservationServiceMock.getAvailableTimeSlots.mockReturnValueOnce(of([]));
      component.checkAvailability(stepperMock);
      expect(component.isAvailable).toBe(false);

      // c: error from service
      reservationServiceMock.getAvailableTimeSlots.mockReturnValueOnce(throwError(() => new Error('oops')));
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      component.checkAvailability(stepperMock);
      expect(spy).toHaveBeenCalledWith('Error loading slots:', expect.any(Error));
      spy.mockRestore();
    });
  });

  describe('reserve', () => {
    beforeEach(() => {
      component.reservationForm.setValue({ reservationDate: new Date('2024-01-10').toDateString(), duration: 44 });
      component.selectedTimeSlot = '12:45:00';
    });

    it('should cover no time slot selected branch', () => {
      component.selectedTimeSlot = null;
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      component.reserve();
      expect(spy).toHaveBeenCalledWith('No time slot selected');
      expect(reservationServiceMock.placeReservation).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should place a reservation and close dialog', () => {
      reservationServiceMock.placeReservation.mockReturnValueOnce(of({}));
      component.reserve();
      expect(reservationServiceMock.placeReservation).toHaveBeenCalledWith(expect.objectContaining({
        resourceId: 42,
        resourceName: 'My Resource',
        startDate: expect.any(String),
        stopDate: expect.any(String)
      }));
      expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('should handle error from placeReservation', () => {
      reservationServiceMock.placeReservation.mockReturnValueOnce(throwError(() => new Error('fail')));
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      component.reserve();
      expect(spy).toHaveBeenCalledWith('Error placing reservation:', expect.any(Error));
      spy.mockRestore();
    });
  });

  it('should cover onTimeSlotSelect and onPreviousStep', () => {
    component.reservationForm.setValue({ reservationDate: new Date().toDateString(), duration: 40 });
    component.onTimeSlotSelect('07:00:00');
    expect(component.selectedTimeSlot).toBe('07:00:00');
    expect(typeof component.selectedTimeSlotText).toBe('string');
    component.onPreviousStep();
    expect(component.selectedTimeSlot).toBeNull();
    expect(component.selectedTimeSlotText).toBeNull();
  });

  it('private formatDateForApi and calculateStopDate are covered via reserve()', () => {
    const iso = (component as any).formatDateForApi(new Date('2024-09-01'), '09:24:55');
    expect(typeof iso).toBe('string');
    const stop = (component as any).calculateStopDate(iso, 30);
    expect(typeof stop).toBe('string');
  });
});
