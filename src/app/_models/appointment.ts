export interface Appointment {
    id?: number;
    patient_id?: number;
    medic_id?: number;
    start?: string;
    end?: string;
    title?: string;
    meta?: string;
  }