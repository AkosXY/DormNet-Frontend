import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateResidentDialogComponent } from './create-resident-dialog.component';

describe('CreateRoomDialogComponent', () => {
  let component: CreateResidentDialogComponent;
  let fixture: ComponentFixture<CreateResidentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateResidentDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateResidentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
