import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSportEventDialogComponent } from './create-sport-event-dialog.component';

describe('CreateSportEventDialogComponent', () => {
  let component: CreateSportEventDialogComponent;
  let fixture: ComponentFixture<CreateSportEventDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSportEventDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSportEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
