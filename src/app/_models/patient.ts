export interface Patient {
  id?: number;
  useR_ID?: number;
  fullname?: string;
  age?: number;
  sex?: Sex;
  address?: string;
  phone?: string;
  email?: string;
  cnp?: string;
  assignatioN_CODE?: string;
  createD_AT?: string;
}

export enum Sex {
  Male = 'm',
  Female = 'f',
}
