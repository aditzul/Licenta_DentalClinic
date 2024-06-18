import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Patient, PatientDialog } from '../_models/patient';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';

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
      cnp: new FormControl(this.data.patient?.cnp || '', [Validators.required, Validators.pattern(/^\d{13}$/)]),
      birth_date: new FormControl(this.data.patient?.birth_date || '', Validators.required),
      sex: new FormControl(this.data.patient?.sex || '', Validators.required),
      country: new FormControl(this.data.patient?.country || '', [Validators.required]),
      state: new FormControl(this.data.patient?.state || '', [Validators.required,]),
      city: new FormControl(this.data.patient?.city || '', [Validators.required,]),
      address: new FormControl(this.data.patient?.address || '', Validators.required),
      phone: new FormControl(this.data.patient?.phone || '', [Validators.required, Validators.pattern(/^\d{10}$/)]),
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
    const details: any = {};
    if (this.data.patient) {
      // If it's an existing patient, set its ID
      details.id = this.data.patient.id;
    }

    // Assign values from form controls to details object
    details.first_name = this.patientForm.get('first_name')?.value;
    details.last_name = this.patientForm.get('last_name')?.value;
    details.cnp = this.patientForm.get('cnp')?.value;
    details.birth_date = this.patientForm.get('birth_date')?.value;
    details.sex = this.patientForm.get('sex')?.value;
    details.address = this.patientForm.get('address')?.value;
    details.phone = this.patientForm.get('phone')?.value;
    details.email = this.patientForm.get('email')?.value;
    details.phisical_file = this.patientForm.get('phisical_file')?.value;
    details.secondary_contact_name = this.patientForm.get('secondary_contact_name')?.value;
    details.secondary_contact_phone = this.patientForm.get('secondary_contact_phone')?.value;
    details.medic_id = this.patientForm.get('medic_id')?.value;
    this.dialogRef.close({
      details,
      patient: details.id, // Include the patient data for identification
    });
  }
}
