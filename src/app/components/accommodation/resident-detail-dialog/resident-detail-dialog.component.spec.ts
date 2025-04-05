import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentDetailDialogComponent } from './resident-detail-dialog.component';

describe('ResidentDetailDialogComponent', () => {
  let component: ResidentDetailDialogComponent;
  let fixture: ComponentFixture<ResidentDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentDetailDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
