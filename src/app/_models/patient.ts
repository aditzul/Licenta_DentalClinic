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

export interface SensorSessionData {
  entrY_ID: number;
  session: SensorData[];
  createD_AT: string;
  temperatureAvg: number;
  heartAvg: number;
  EKGAvg: number;
}

export interface SensorData {
  id: number;
  entrY_ID: number;
  temperature: number;
  pulse: number;
  ekg: number;
  patienT_ID: number;
  anomaly: boolean;
  assignatioN_CODE: string;
  createD_AT: string;
}

export interface PatientComment {
  id: number;
  patienT_ID: number;
  mediC_ID: number;
  comment: string;
  commenT_TYPE: boolean;
  createD_AT: string;
}

export interface PatientHistory {
  id: number;
  patienT_ID: number;
  hospital: string;
  intervention: string;
  interventioN_DATE: string;
  createD_AT: string;
}
