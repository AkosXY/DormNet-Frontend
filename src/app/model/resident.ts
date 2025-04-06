export interface ResidentBase {
  name: string;
  username: string;
  email: string;
  phone: string;
}

export interface Resident extends ResidentBase {
  id: number;
}
