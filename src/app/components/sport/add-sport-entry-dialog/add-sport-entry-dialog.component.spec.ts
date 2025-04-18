import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSportEntryDialogComponent } from './add-sport-entry-dialog.component';

describe('AddSportEntryDialogComponent', () => {
  let component: AddSportEntryDialogComponent;
  let fixture: ComponentFixture<AddSportEntryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSportEntryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSportEntryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
