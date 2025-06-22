import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateResidentDialogComponent } from './create-resident-dialog.component';
import { AccommodationService } from '../../../services/api/accommodation.service';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('CreateResidentDialogComponent', () => {
  let component: CreateResidentDialogComponent;
  let serviceMock: { createResident: jest.Mock };
  let dialogRefMock: { close: jest.Mock };

  beforeEach(() => {
    serviceMock = { createResident: jest.fn() };
    dialogRefMock = { close: jest.fn() };

    TestBed.configureTestingModule({
      imports: [
        CreateResidentDialogComponent,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: AccommodationService, useValue: serviceMock },
        { provide: MatDialogRef, useValue: dialogRefMock }
      ]
    });

    const fixture = TestBed.createComponent(CreateResidentDialogComponent);
    component = fixture.componentInstance;
  });

  it('should not submit if form invalid', () => {
    component.submit();
    expect(serviceMock.createResident).not.toHaveBeenCalled();
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });

  it('should call service and close dialog on successful submit', () => {
    component.submitForm.patchValue({
      nameForm: 'Test Name',
      usernameForm: 'testuser',
      phoneForm: '123456789',
      emailForm: 'test@example.com',
    });
    serviceMock.createResident.mockReturnValue(of(true));
    component.submit();
    expect(serviceMock.createResident).toHaveBeenCalledWith({
      name: 'Test Name',
      username: 'testuser',
      phone: '123456789',
      email: 'test@example.com',
    });
    expect(dialogRefMock.close).toHaveBeenCalledWith('refresh');
  });

  it('should not close dialog if service returns false', () => {
    component.submitForm.patchValue({
      nameForm: 'Test Name',
      usernameForm: 'testuser',
      phoneForm: '123456789',
      emailForm: 'test@example.com',
    });
    serviceMock.createResident.mockReturnValue(of(false));
    component.submit();
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });
});
