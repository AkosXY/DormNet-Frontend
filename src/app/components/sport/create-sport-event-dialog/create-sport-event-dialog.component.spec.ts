import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateSportEventDialogComponent } from './create-sport-event-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SportService } from '../../../services/api/sport.service';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';

const matDialogRefMock = { close: jest.fn() };
const sportServiceMock = { createSportEvent: jest.fn() };
const datePipeMock = {
  transform: jest.fn(() => '2024-06-20')
};

describe('CreateSportEventDialogComponent', () => {
  let component: CreateSportEventDialogComponent;
  let fixture: ComponentFixture<CreateSportEventDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSportEventDialogComponent, ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: SportService, useValue: sportServiceMock },
        { provide: DatePipe, useValue: datePipeMock },
      ],
    }).compileComponents();

    jest.clearAllMocks();

    fixture = TestBed.createComponent(CreateSportEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form initially', () => {
    expect(component.submitForm.valid).toBe(false);
    expect(component.submitForm.value).toEqual({ name: '', date: null });
  });

  it('should be invalid if only one field is filled', () => {
    component.submitForm.setValue({ name: 'Event', date: null });
    expect(component.submitForm.valid).toBe(false);

    component.submitForm.setValue({ name: '', date: new Date() });
    expect(component.submitForm.valid).toBe(false);
  });

  it('should be valid if both fields are filled', () => {
    component.submitForm.setValue({ name: 'Event', date: new Date() });
    expect(component.submitForm.valid).toBe(true);
  });

  it('should call createSportEvent and close dialog on valid submit and success', () => {

    const fakeDate = new Date(2024, 5, 20);
    component.submitForm.setValue({ name: 'My Event', date: fakeDate });

    (sportServiceMock.createSportEvent as jest.Mock).mockReturnValue(of(true));

    component.submit();

    expect(datePipeMock.transform).toHaveBeenCalledWith(fakeDate, 'yyyy-MM-dd');
    expect(sportServiceMock.createSportEvent).toHaveBeenCalledWith({
      name: 'My Event',
      date: '2024-06-20'
    });
    expect(matDialogRefMock.close).toHaveBeenCalledWith('refresh');
  });

  it('should not close dialog if service returns false', () => {
    const fakeDate = new Date(2024, 5, 20);
    component.submitForm.setValue({ name: 'Event', date: fakeDate });
    (sportServiceMock.createSportEvent as jest.Mock).mockReturnValue(of(false));

    component.submit();

    expect(matDialogRefMock.close).not.toHaveBeenCalled();
  });

  it('should do nothing if form invalid on submit', () => {
    component.submitForm.setValue({ name: '', date: null });
    component.submit();
    expect(sportServiceMock.createSportEvent).not.toHaveBeenCalled();
    expect(matDialogRefMock.close).not.toHaveBeenCalled();
  });
});
