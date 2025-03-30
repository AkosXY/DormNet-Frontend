import { Resident } from './resident';

export interface Room {
  id: number;
  capacity: number;
  numOfResidents: number;
  residents: Resident[];
}
