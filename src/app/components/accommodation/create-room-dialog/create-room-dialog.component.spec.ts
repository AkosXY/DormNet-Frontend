import { TestBed } from '@angular/core/testing';
import { CreateRoomDialogComponent } from './create-room-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { AccommodationService } from '../../../services/api/accommodation.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('CreateRoomDialogComponent', () => {
  let component: CreateRoomDialogComponent;
  let dialogRefMock: { close: jest.Mock };
  let serviceMock: { createRoom: jest.Mock };

  beforeEach(() => {
    dialogRefMock = { close: jest.fn() };
    serviceMock = { createRoom: jest.fn() };

    TestBed.configureTestingModule({
      imports: [CreateRoomDialogComponent, ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: AccommodationService, useValue: serviceMock },
      ],
    });

    const fixture = TestBed.createComponent(CreateRoomDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submitForm should be invalid by default', () => {
    expect(component.submitForm.invalid).toBe(true);
  });

  it('submitForm should be valid with correct values', () => {
    component.submitForm.patchValue({ numberForm: 'A101', capacityForm: 4 });
    expect(component.submitForm.valid).toBe(true);
  });

  it('should not call service or close dialog if form invalid', () => {
    component.submitForm.patchValue({ numberForm: '' }); // missing required
    component.submit();
    expect(serviceMock.createRoom).not.toHaveBeenCalled();
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });

  it('should call createRoom and close dialog on successful submit', () => {
    component.submitForm.patchValue({ numberForm: 'B202', capacityForm: 3 });
    component.capacity = 3; // simulate slider
    serviceMock.createRoom.mockReturnValue(of(true));
    component.submit();
    expect(serviceMock.createRoom).toHaveBeenCalledWith({
      number: 'B202',
      capacity: 3,
      numOfResidents: 0,
    });
    expect(dialogRefMock.close).toHaveBeenCalledWith('refresh');
  });

  it('should not close dialog if createRoom returns false', () => {
    component.submitForm.patchValue({ numberForm: 'B202', capacityForm: 3 });
    component.capacity = 3;
    serviceMock.createRoom.mockReturnValue(of(false));
    component.submit();
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });

  it('numberForm and capacityForm getters should return FormControl', () => {
    expect(component.numberForm).toBeTruthy();
    expect(component.capacityForm).toBeTruthy();
  });
});
