import { Patient } from './patient';

export enum Role {
  Admin = 0,
  Medic = 1,
}

export interface User {
  id?: number;
  username?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: Role;
  created_at?: string;
}

export interface Medic {
  id: number;
  first_name: string;
  last_name: string;
}

export interface UserDialog {
  user: User;
  medic: Medic | null;
  patient: Patient | null;
  allMedics: Medic[];
}
