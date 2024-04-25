import { Patient } from './../_models/patient';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { PatientService } from '../_services/patient.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../_helpers/confirm-dialog/confirm-dialog.component';
import { PatientDialogComponent } from '../patient-dialog/patient-dialog.component';
import { AuthenticationService } from '../_services/authentication.service';
import { Role } from '../_models/user';

@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.scss'],
})
export class PatientTableComponent implements OnInit {
  @Input() patients: Patient[] = [];
  @Input() isEdit = false;
  @Input() title = '';

  displayedColumns: string[] = ['ID', 'SEX', 'FIRST_NAME', 'LAST_NAME', 'AGE', 'CNP', 'CREATED_AT', 'Actions'];

  dataSource = new MatTableDataSource(this.patients);

  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};

  constructor(
    private router: Router,
    private patientService: PatientService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.dataSource.data = this.patients;
    this.loadPatients();
  }

  private loadPatients() {
    const userRole = this.authService.userValue?.role;
  
    if (userRole === Role.Admin) {
<<<<<<< HEAD
      this.patientService.getAllPatients().subscribe((patients: Patient[]) => {
        this.patients = patients;
      });
    } else if (userRole === Role.Medic) {
      const medic_id = this.authService.userValue?.id;
      if (medic_id) {
        this.patientService.getPatientsByMedicID(medic_id.toString()).subscribe((response: any) => {
          this.patients = response;
=======
      // User is an Admin, load all patients
      this.patientService.getAllPatients().subscribe((response: any) => {
        this.patients = response;
        this.dataSource.data = this.patients;
      });
    } else if (userRole === Role.Medic) {
      // User is a Medic, load patients by Medic ID
      const medicId = this.authService.userValue?.id;
      if (medicId) {
        this.patientService.getPatientsByMedicID(medicId.toString()).subscribe((response: any) => {
          this.patients = response.assignedPatients;
          this.dataSource.data = this.patients;
>>>>>>> parent of 3e79fcd (Fixed viewing patients for both admins and medics on all tables)
        });
      } else {
        console.error('Medic ID not found in user details.');
      }
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async addPatient() {
    const dialogRef = this.dialog.open(PatientDialogComponent, {
      data: {
        patient: {},
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      const { patient, details } = result;

      this.patientService.addPatient(<Patient>details).subscribe(() => {
        this.refreshData();
      });
    });
  }

  editPatient(patient: Patient) {
<<<<<<< HEAD
    const dialogRef = this.dialog.open(PatientDialogComponent, {
      data: {
        patient,
=======
    const patientId: number = patient.ID as number;
    this.patientService.getPatientById(patientId.toString()).subscribe(
      (patientDetails: Patient) => {
        const dialogRef = this.dialog.open(PatientDialogComponent, {
          data: {
            patient: patientDetails,
            allMedics: this.medics,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (!result) return;
          const { patient, details } = result;

          this.patientService.updatePatient(patient).subscribe(() => {
            this.refreshData();

            this.patientService.updatePatient(<Patient>details).subscribe(() => {
              this.refreshData();
            });
          });
        });
>>>>>>> parent of 3e79fcd (Fixed viewing patients for both admins and medics on all tables)
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      const { patient, details } = result;
      this.patientService.updatePatient(details).subscribe(() => {
        this.refreshData();
      });
    });
  }

  deletePatient(patient: Patient) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to delete this patient?',
      } as ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.patientService.deletePatient(patient).subscribe(
          () => {
            this.dataSource.data = this.dataSource.data.filter(p => p.ID !== patient.ID);
          },
        );
      }
    });
  }

  goToPatient(patient: Patient) {
    this.router.navigate([`/patients/${patient.ID}`]);
  }

  private refreshData() {
    this.patientService.getAllPatients().subscribe((patients: Patient[]) => {
      this.patients = patients;
      this.dataSource.data = Object.values(this.patients);
    });
  }

}
