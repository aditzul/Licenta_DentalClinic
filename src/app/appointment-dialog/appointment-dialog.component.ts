import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Patient } from '../_models/patient';
import { PatientService } from '../_services/patient.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../_helpers/confirm-dialog/confirm-dialog.component';
import { AppointmentService } from '../_services/appointment.service'; // Importă AppointmentService

@Component({
  selector: 'app-appointment-dialog',
  templateUrl: './appointment-dialog.component.html',
  styleUrls: ['./appointment-dialog.component.scss']
})
export class AppointmentDialogComponent implements OnInit {
  inputData: any = {};
  patients: Patient[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AppointmentDialogComponent>,
    private patientService: PatientService,
    private dialog: MatDialog, // Injectează MatDialog
    private appointmentService: AppointmentService // Injectează AppointmentService
  ) {}

  ngOnInit(): void {
    this.inputData = this.data;
    this.getAllPatients();
  }

  getAllPatients() {
    this.patientService.getAllPatients().subscribe((patients: Patient[]) => {
      this.patients = patients;
    });
  }

  saveCalendarEventDialog(): void {
    // Get the selected values from the form
    const startDate: Date = new Date(this.inputData.startDate);
    const startTime: string = this.inputData.startTime;
    const endTime: string = this.inputData.endTime;
    const selectedPatient: string = this.inputData.selectedPatient.fullname;
    const selectedStatus: string = this.inputData.selectedStatus;
    const patient_id = this.inputData.selectedPatient.patient_id;
    const medic_id = this.inputData.selectedPatient.medic_id

    // Combine date and time to create start and end Date objects
    const startDateTime: Date = new Date(`${startDate.toISOString().split('T')[0]}T${startTime}`);
    const endDateTime: Date = new Date(`${startDate.toISOString().split('T')[0]}T${endTime}`);

    // Pass the data back to the parent component
    this.dialogRef.close({
      start: startDateTime,
      end: endDateTime,
      title: selectedPatient,
      meta: selectedStatus,
      patient_id: patient_id,
      medic_id: medic_id,
    });
  }
}