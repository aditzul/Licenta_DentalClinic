import { Medic } from './medic';
import { Patient } from './patient';

export enum Role {
  Admin = 0,
  Medic = 1,
  Patient = 2,
}

export interface User {
  id?: number;
  email?: string;
  password?: string;
  role?: Role;
  createD_AT?: string;
}

export interface UserDialog {
  user: User;
  medic: Medic | null;
  patient: Patient | null;
}

