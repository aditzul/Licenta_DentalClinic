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

// Replace this with the actual type or interface for your data
interface PatientsData {
  assignedPatients: Patient[];
}

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
  medics: any;

  constructor(
    private router: Router,
    private patientService: PatientService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService,
  ) {}

  ngOnInit() {
    const userRole = this.authService.userValue?.role;
  
    if (userRole === Role.Admin) {
      // User is an Admin, load all patients
      this.patientService.getAllPatients().subscribe((response: any) => {
        if (response.data && response.data.length > 0) {
          this.dataSource.data = response.data[0]
        } else {
          console.error('No patients data found.');
        }
      });
    } else if (userRole === Role.Medic) {
      // User is a Medic, load patients by Medic ID
      const medicId = this.authService.userValue?.id;
      if (medicId) {
        this.patientService.getPatientsByMedicID(medicId.toString()).subscribe((response: any) => {
          if (response.data && response.data.length > 0) {
            this.dataSource.data = response.data[0];
          } else {
            console.error('No patients data found.');
          }
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
      },
      (error) => {
        console.error('Error fetching patient details:', error);
      }
    );
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
      this.dataSource.data = this.patients;
    });
  }
}
