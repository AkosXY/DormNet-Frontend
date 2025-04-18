export interface ReservationBase {
  resourceId: number;
  resourceName: string;
  startDate: string;
  stopDate: string;
}

export interface Reservation extends ReservationBase {
  id: number;
  reservationNumber: string;
  email: string;
}
