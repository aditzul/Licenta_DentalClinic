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
  send_sms?: number;
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
  patient_id: number;
  comment: string;
  created_at: string;
}

export interface PatientHistory {
  id: number;
  patient_id: number;
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

export interface Tooth {
  id: string;
  patient_id: number;
  tooth_id: number;
  dental_work_id: number;
  extracted?: number;
  comment?: string;
  date?: Date;
  x: number;
  y: number;
}

export interface ToothDraw {
  id: string;
  x: number;
  y: number;
  touched: boolean;
  extracted: number;
}