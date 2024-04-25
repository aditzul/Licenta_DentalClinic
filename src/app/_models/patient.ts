export interface Patient {
  id?: number;
  first_name?: string;
  last_name?: string;
  cnp?: string;
  age?: number;
  birth_date?: string;
  sex?: Sex;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  phisical_file?: string;
  secondary_contact_name?: string;
  secondary_contact_phone?: string;
  medic_id?: string;
  created_at?: string;
}

export interface AssignedPatientsData {
  assignedPatients: Patient[];
}

export enum Sex {
  Male = 'M',
  Female = 'F',
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
  MEDIC_ID: number;
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