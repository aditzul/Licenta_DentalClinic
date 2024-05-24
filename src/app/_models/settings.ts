export interface SMSOSettings {
    SMSO_SENDER_ID: number;
    SMSO_API_KEY: string;
  }

export interface Work {
  id?: number;
  work_name?: string;
}

export interface Disease {
  id?: number;
  disease_name?: string;
}

export interface MedicalIssue {
  id?: number;
  medical_issue_name?: string;
}


export interface SMSSettings {
  SMS_SEND_SMS: number;
  SMS_SEND_HOUR: string;
  SMS_SEND_DAYS: number;
  SMS_TEMPLATE: string;
}

export interface CompanySettings {
  COMPANY_NAME: string;
  COMPANY_VAT: string;
  COMPANY_TAX_NUMBER: string;
  COMPANY_ADDRESS: string;
}
