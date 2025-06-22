import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

const matDialogRefMock = { close: jest.fn() };

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: 'Are you sure?' }
      ]
    }).compileComponents();

    jest.clearAllMocks();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive the message from MAT_DIALOG_DATA injection', () => {
    expect(component.message).toBe('Are you sure?');
  });

  it('should close dialog with `true` on confirm', () => {
    component.onConfirm();
    expect(matDialogRefMock.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog with `false` on cancel', () => {
    component.onCancel();
    expect(matDialogRefMock.close).toHaveBeenCalledWith(false);
  });
});
