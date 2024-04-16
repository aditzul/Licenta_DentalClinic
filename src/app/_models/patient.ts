export interface Patient {
  ID?: number;
  FIRST_NAME?: string;
  LAST_NAME?: string;
  CNP?: string;
  AGE?: number;
  BIRTH_DATE?: string;
  SEX?: Sex;
  COUNTRY?: string;
  COUNTY?: string;
  CITY?: string;
  ADDRESS?: string;
  PHONE?: string;
  EMAIL?: string;
  PHISICAL_FILE?: string;
  SECONDARY_CONTACT_NAME?: string;
  SECONDARY_CONTACT_PHONE?: string;
  MEDIC_ID?: string;
  CREATED_AT?: string;
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