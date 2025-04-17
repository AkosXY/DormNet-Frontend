export interface ReservationBase {
  resourceId: number;
  resourceName: number;
  reservationNumber: string;
  startDate: string;
  stopDate: string;
  email: string;
}

export interface Reservation extends ReservationBase {
  id: number;
}
