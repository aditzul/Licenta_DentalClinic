import { MedicService } from './../_services/medic.service';
import { Role, User } from './../_models/user';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '../_services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { PatientService } from '../_services/patient.service';
import { Patient } from '../_models/patient';
import { Medic } from '../_models/medic';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  patients: Patient[] = [];
  medics: Medic[] = [];
  displayedColumns: string[] = ['id', 'role', 'username', 'createD_AT', 'actions'];
  dataSource = new MatTableDataSource(this.users);
  roleFilter?: string = 'clear';

  constructor(private userService: UserService, private patientService: PatientService, private medicService: MedicService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.refreshData();
  }

  filterChange(event: MatButtonToggleChange | any) {
    const { value } = event;
    const { users } = this;

    switch (value) {
      case 'clear':
        this.dataSource.data = users;
        break;
      case 'admin':
        this.dataSource.data = users.filter((u) => u.role === Role.Admin);
        break;
      case 'medic':
        this.dataSource.data = users.filter((u) => u.role === Role.Medic);
        break;
      case 'patient':
        this.dataSource.data = users.filter((u) => u.role === Role.Patient);
        break;
      default:
        this.dataSource.data = users;
    }
  }

  refreshData() {
    this.userService.getAllUsers().subscribe((users: User[]) => {
      this.users = users;
      this.filterChange({ value: this.roleFilter });
    });

    this.patientService.getAllPatients().subscribe((patients: Patient[]) => {
      this.patients = patients;
    });

    this.medicService.getAllMedics().subscribe((medics: Medic[]) => {
      this.medics = medics;
    });
  }

  deleteUser(user: User) {
    this.userService.deleteUser(user).subscribe(() => {
      this.refreshData();
    });
  }

  async addUser() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: {
        user: {},
        patient: null,
        medic: null,
        allMedics: this.medics,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      const { user, details } = result;

      this.userService.addUser(user).subscribe(() => {
        if (user.role == Role.Admin) {
          this.refreshData();
        }

        this.userService.getLastId().subscribe((id: number) => {
          details.useR_ID = id;

          if (user.role == Role.Medic) {
            this.medicService.addMedic(<Medic>details).subscribe(() => {
              this.refreshData();
            });
          }

          if (user.role == Role.Patient) {
            this.patientService.addPatient(<Patient>details).subscribe(() => {
              this.refreshData();
            });
          }
        });
      });
    });
  }

  editUser(user: User) {
    const patient = this.patients.find((p) => p.useR_ID === user.id) || null;
    const medic = this.medics.find((m) => m.useR_ID === user.id) || null;

    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: {
        user,
        patient,
        medic,
        allMedics: this.medics,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      const { user, details } = result;

      this.userService.updateUser(user).subscribe(() => {
        if (user.role == Role.Admin) {
          this.refreshData();
        }

        if (user.role == Role.Medic) {
          this.medicService.updateMedic(<Medic>details).subscribe(() => {
            this.refreshData();
          });
        }

        if (user.role == Role.Patient) {
          this.patientService.updatePatient(<Patient>details).subscribe(() => {
            this.refreshData();
          });
        }
      });
    });
  }
}
