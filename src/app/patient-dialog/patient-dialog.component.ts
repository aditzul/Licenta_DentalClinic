import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Patient, PatientDialog } from '../_models/patient';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';

// Funcția de validare pentru număr de telefon românesc
function validatePhoneNumberRO(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const phoneNumber = control.value;

    // Expresia regulată pentru validarea numărului de telefon românesc
    const roPhoneNumberPattern = /^(0[2-9][0-9]{8,9})$/;

    // Verificăm dacă numărul de telefon respectă expresia regulată
    if (roPhoneNumberPattern.test(phoneNumber)) {
      return null; // Numărul de telefon este valid
    } else {
      return { 'invalidPhoneNumberRO': true }; // Numărul de telefon nu este valid
    }
  };
}

// Funcția de validare pentru CNP-ul românesc
function validateCNP(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cnp = control.value;

    // Verificăm dacă CNP-ul este completat
    if (!cnp) {
      return { 'required': true };
    }

    // Expresia regulată pentru validarea CNP-ului românesc
    const cnpPattern = /^\d{13}$/;

    // Verificăm dacă CNP-ul respectă expresia regulată
    if (cnpPattern.test(cnp)) {
      // Verificăm și cifra de control
      const controlDigit = parseInt(cnp.charAt(12), 10);
      const digits = cnp.substring(0, 12).split('').map(Number);
      const weights = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        sum += digits[i] * weights[i];
      }
      const remainder = sum % 11;
      const validControlDigit = (remainder === 10 ? 1 : remainder) === controlDigit;

      if (!validControlDigit) {
        return { 'invalidCNP': true };
      }

      return null; // CNP-ul este valid
    } else {
      return { 'invalidCNP': true }; // CNP-ul nu este valid
    }
  };
}

interface FormField {
  label: string;
  formControlName: string;
  type: string;
}

@Component({
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.component.html',
  styleUrls: ['./patient-dialog.component.scss']
})
export class PatientDialogComponent implements OnInit {
  isAdd: boolean;
  patientForm!: FormGroup;
  allMedics: User[] = [];
  patient: Patient | undefined;
  submitted: boolean = false;
  formFields: FormField[] = [
    {
      label: 'Prenume',
      formControlName: 'first_name',
      type: 'text',
    },
    {
      label: 'Nume',
      formControlName: 'last_name',
      type: 'text',
    },
    {
      label: 'CNP',
      formControlName: 'cnp',
      type: 'text',
    },
    {
      label: 'Adresă',
      formControlName: 'address',
      type: 'text',
    },
    {
      label: 'Telefon',
      formControlName: 'phone',
      type: 'tel',
    },
    {
      label: 'Email',
      formControlName: 'email',
      type: 'email',
    },
    {
      label: 'Țară',
      formControlName: 'country',
      type: 'text',
    },
    {
      label: 'Județ',
      formControlName: 'state',
      type: 'text',
    },
    {
      label: 'Oraș',
      formControlName: 'city',
      type: 'text',
    },
    {
      label: 'Număr dosar fizic',
      formControlName: 'phisical_file',
      type: 'text',
    },
    {
      label: 'Nume contact secundar',
      formControlName: 'secondary_contact_name',
      type: 'text',
    },
    {
      label: 'Telefon contact secundar',
      formControlName: 'secondary_contact_phone',
      type: 'tel',
    },
  ];

  constructor(
    public dialogRef: MatDialogRef<PatientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PatientDialog,
    private userService: UserService,
  ) {
    this.isAdd = !this.data.patient?.id
  }

  ngOnInit() {
    this.userService.getAllMedics().subscribe(
      (medics: User[]) => {
        this.allMedics = medics;
        this.initializeForm();
      },
      (error) => {
        console.error('Error fetching medics:', error);
      }
    );
  }

  initializeForm() {
    this.patientForm = new FormGroup({
      first_name: new FormControl(this.data.patient?.first_name || '', Validators.required),
      last_name: new FormControl(this.data.patient?.last_name || '', Validators.required),
      cnp: new FormControl(this.data.patient?.cnp || '', [
        Validators.required,
        validateCNP() // Validare custom pentru CNP-ul românesc
      ]),
      country: new FormControl(this.data.patient?.country || '', [Validators.required]),
      state: new FormControl(this.data.patient?.state || '', [Validators.required]),
      city: new FormControl(this.data.patient?.city || '', [Validators.required]),
      address: new FormControl(this.data.patient?.address || '', Validators.required),
      phone: new FormControl(this.data.patient?.phone || '', [
        Validators.required,
        validatePhoneNumberRO() // Validare custom pentru număr de telefon românesc
      ]),
      email: new FormControl(this.data.patient?.email || '', [Validators.required, Validators.email]),
      phisical_file: new FormControl(this.data.patient?.phisical_file || ''),
      secondary_contact_name: new FormControl(this.data.patient?.secondary_contact_name || ''),
      secondary_contact_phone: new FormControl(this.data.patient?.secondary_contact_phone || ''),
      medic_id: new FormControl(this.data.patient?.medic_id || (this.allMedics.length > 0 ? this.allMedics[0].id : '')),
    });
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.patientForm.invalid) {
      return; // Împiedicăm trimiterea formularului dacă nu este valid
    }

    const details = this.patientForm.value;

    // Dacă este un pacient existent, setăm ID-ul
    if (this.data.patient) {
      details.id = this.data.patient.id;
    }

    this.dialogRef.close({
      details,
      patient: details.id, // Includem datele pacientului pentru identificare
    });
  }
}
