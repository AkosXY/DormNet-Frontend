import { TestBed } from '@angular/core/testing';
import { ReservationComponent } from './reservation.component';
import { ReservationService } from '../../services/api/reservation.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import {provideNativeDateAdapter} from '@angular/material/core';

const mockReservations = [
  { resourceName: 'Room 1', email: 'x@example.com', startDate: new Date('2024-03-27T09:00') },
  { resourceName: 'Room 2', email: 'y@example.com', startDate: new Date('2024-03-28T09:00') },
] as any[];

describe('ReservationComponent', () => {
  let component: ReservationComponent;
  let reservationServiceMock: {
    getAllReservations: jest.Mock
  };

  beforeEach(() => {
    reservationServiceMock = {
      getAllReservations: jest.fn().mockReturnValue(of(mockReservations)),
    };

    TestBed.configureTestingModule({
      imports: [ReservationComponent],
      providers: [
        { provide: ReservationService, useValue: reservationServiceMock },
        { provide: MatDialog, useValue: { open: jest.fn() } },
        provideNativeDateAdapter(),
      ]
    });

    const fixture = TestBed.createComponent(ReservationComponent);
    component = fixture.componentInstance;
    // mock paginator and sort just to avoid errors
    component.paginator = {} as any;
    component.sort = {} as any;
    // mock ViewChild input for debounce test
    component.input = { nativeElement: document.createElement('input') };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllReservations in initTable, fill data', () => {
    component.initTable();
    expect(reservationServiceMock.getAllReservations).toHaveBeenCalled();
    // Data is set asynchronously due to observable
    setTimeout(() => {
      expect(component.dataSource.data.length).toBe(2);
      expect(component.allReservations[0].resourceName).toBe('Room 1');
    });
  });

  it('should apply filter', () => {
    component.allReservations = mockReservations;
    component.dataSource = new MatTableDataSource(mockReservations);
    component.applyFilter('room 1');
    expect(component.dataSource.filter).toBe('room 1');
  });

  it('should reset filter with empty date selection', () => {
    component.allReservations = mockReservations;
    component.dataSource = new MatTableDataSource([]);
    component.onDateFilterChange(null);
    expect(component.dataSource.data).toEqual(mockReservations);
  });

  it('should filter by date correctly', () => {
    component.allReservations = mockReservations;
    component.dataSource = new MatTableDataSource(mockReservations);

    const dateToFilter = new Date(mockReservations[0].startDate);
    component.onDateFilterChange(dateToFilter);
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].resourceName).toBe('Room 1');
  });

});
