import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservationCardComponent } from './reservation-card.component';

describe('ReservationCardComponent', () => {
  let component: ReservationCardComponent;
  let fixture: ComponentFixture<ReservationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationCardComponent);
    component = fixture.componentInstance;
    component.reservation = { id: 123, resourceName: 'Test', startDate: new Date().toDateString(), reservationNumber:"", email:"", resourceId:1, stopDate:"" };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the reservation when onDeleteClick is called', () => {
    const spy = jest.spyOn(component.delete, 'emit');
    component.onDeleteClick();
    expect(spy).toHaveBeenCalledWith(component.reservation);
  });
});
