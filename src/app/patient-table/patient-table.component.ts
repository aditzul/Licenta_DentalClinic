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

  displayedColumns: string[] = ['id', 'sex', 'first_name', 'last_name', 'age', 'cnp', 'created_at', 'actions'];

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
    const dialogRef = this.dialog.open(PatientDialogComponent, {
      data: {
        patient,
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
            this.dataSource.data = this.dataSource.data.filter(p => p.id !== patient.id);
          },
        );
      }
    });
  }

  goToPatient(patient: Patient) {
    this.router.navigate([`/patients/${patient.id}`]);
  }

  private refreshData() {
    this.patientService.getAllPatients().subscribe((patients: Patient[]) => {
      this.patients = patients;
      this.dataSource.data = this.patients;
    });
  }

}
