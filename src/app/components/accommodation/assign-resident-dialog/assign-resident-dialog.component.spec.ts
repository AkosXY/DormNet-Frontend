import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignResidentDialogComponent } from './assign-resident-dialog.component';

describe('AssignResidentDialogComponent', () => {
  let component: AssignResidentDialogComponent;
  let fixture: ComponentFixture<AssignResidentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignResidentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignResidentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
