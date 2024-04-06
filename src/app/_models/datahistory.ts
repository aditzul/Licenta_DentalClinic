export interface DataHistory {
    id?: number;
    patient_id?: number;
    changed_by?: string;
    field_name?: string;
    old_value?: string;
    new_value?: string;
  }