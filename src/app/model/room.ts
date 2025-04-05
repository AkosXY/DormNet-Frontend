import { Resident } from './resident';

export interface Room {
  id: number;
  number: string;
  capacity: number;
  numOfResidents: number;
  residents: Resident[];
}
