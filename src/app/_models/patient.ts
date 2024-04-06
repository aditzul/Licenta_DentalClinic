export interface Patient {
  patienT_ID?: number;
  fullname?: string;
  cnp?: string;
  birtH_DATE?: string;
  sex?: Sex;
  age?: number;
  address?: string;
  phone?: string;
  email?: string;
  phisicaL_FILE?: string;
  secondarY_CONTACT?: string;
  mediC_ID?: string;
  createD_AT?: string;
}

export interface AssignedPatientsData {
  assignedPatients: Patient[];
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

export interface PatientDialog {
  patient: Patient | null;
}

export interface PatientHistory {
  ChangeDate?: Date
  ChangedBy?: string;
  FieldName?: string;
  OldValue?: string;
  NewValue?: string;
}