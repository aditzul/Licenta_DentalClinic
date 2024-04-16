export interface Appointment {
    id?: number;
    patient_id?: number;
    medic_id?: number;
    start_time?: string;
    end_time?: string;
    title?: string;
    meta?: string;
    created_at?: string;
    sms_sent?: number;
  }