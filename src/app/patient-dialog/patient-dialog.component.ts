import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Patient, PatientDialog } from '../_models/patient';
import { Medic } from '../_models/medic';
import { MedicService } from '../_services/medic.service';

@Component({
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.component.html',
  styleUrls: ['./patient-dialog.component.scss']
})
export class PatientDialogComponent implements OnInit {
  isAdd: boolean;
  patientForm!: FormGroup;
  allMedics: Medic[] = [];
  patient: Patient | undefined;
  submitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<PatientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PatientDialog,
    private medicService: MedicService,
  ) {
    this.isAdd = !this.data.patient?.ID
  }

  ngOnInit() {
    this.medicService.getAllMedics().subscribe(
      (medics: Medic[]) => {
        this.allMedics = medics;
        this.initializeForm();
      },
      (error) => {
        console.error('Error fetching medics:', error);
      }
    );

    // If patient data is available in the dialog, set the 'patient' property
    if (this.data.patient) {
      this.patient = this.data.patient;
    }
  }

  initializeForm() {
    this.patientForm = new FormGroup({
      first_name: new FormControl(this.patient?.FIRST_NAME || '', Validators.required),
      cnp: new FormControl(this.patient?.CNP || '', [Validators.required, Validators.pattern(/^\d{13}$/)]),
      birth_date: new FormControl(this.patient?.BIRTH_DATE || '', Validators.required),
      sex: new FormControl(this.patient?.SEX || '', Validators.required),
      address: new FormControl(this.patient?.ADDRESS || '', Validators.required),
      phone: new FormControl(this.patient?.PHONE || '', [Validators.required, Validators.pattern(/^\d{10}$/)]),
      email: new FormControl(this.patient?.EMAIL || '', [Validators.required, Validators.email]),
      phisical_file: new FormControl(this.patient?.PHISICAL_FILE || ''),
      secondary_contact: new FormControl(this.patient?.SECONDARY_CONTACT_NAME || ''),
      medic_user_id: new FormControl(this.patient?.MEDIC_ID || (this.allMedics.length > 0 ? this.allMedics[0].id : '')),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.submitted = true;
    const details: any = {};

    if (this.patient) {
      // If it's an existing patient, set its ID
      details.PATIENT_ID = this.patient.ID;
    }

    // Assign values from form controls to details object
    details.fullname = this.patientForm.get('fullname')?.value;
    details.CNP = this.patientForm.get('cnp')?.value;
    details.birth_date = this.patientForm.get('birth_date')?.value;
    details.sex = this.patientForm.get('sex')?.value;
    details.address = this.patientForm.get('address')?.value;
    details.PHONE = this.patientForm.get('phone')?.value;
    details.EMAIL = this.patientForm.get('email')?.value;
    details.PHISICAL_FILE = this.patientForm.get('phisical_file')?.value;
    details.secondary_contact = this.patientForm.get('secondary_contact')?.value;
    details.MEDIC_ID = this.patientForm.get('medic_user_id')?.value;

    this.dialogRef.close({
      details,
      patient: this.patient, // Include the patient data for identification
    });
  }
}
