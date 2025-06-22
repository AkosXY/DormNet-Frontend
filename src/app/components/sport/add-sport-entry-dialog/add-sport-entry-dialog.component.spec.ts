import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddSportEntryDialogComponent } from './add-sport-entry-dialog.component';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SportService } from '../../../services/api/sport.service';

const matDialogRefMock = { close: jest.fn() };
const sportServiceMock = { addEntryToSportEvent: jest.fn() };

describe('AddSportEntryDialogComponent', () => {
  let component: AddSportEntryDialogComponent;
  let fixture: ComponentFixture<AddSportEntryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        AddSportEntryDialogComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { id: 1 } },
        { provide: SportService, useValue: sportServiceMock }
      ]
    }).compileComponents();

    sportServiceMock.addEntryToSportEvent.mockReturnValue(of({}));
    jest.clearAllMocks();
    fixture = TestBed.createComponent(AddSportEntryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit valid form and close dialog', () => {
    component.submitForm.setValue({ name: 'Zoe', score: "7" });
    (sportServiceMock.addEntryToSportEvent as jest.Mock).mockReturnValue(of({}));

    component.submit();

    expect(sportServiceMock.addEntryToSportEvent).toHaveBeenCalledWith(
      1,
      { participantName: 'Zoe', score: 7 }
    );
    expect(matDialogRefMock.close).toHaveBeenCalledWith('refresh');
  });

  });
