import { Resident } from './resident';

export interface RoomBase {
  number: string;
  capacity: number;
  numOfResidents: number;
}

export interface Room extends RoomBase {
  id: number;
  residents: Resident[];
}
