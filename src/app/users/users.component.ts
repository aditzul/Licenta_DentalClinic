import { MedicService } from './../_services/medic.service';
import { Role, User } from './../_models/user';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { UserService } from '../_services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { Medic } from '../_models/medic';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent, ConfirmDialogData } from '../_helpers/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  medics: Medic[] = [];
  visibleRowIndex: number = -1;
  displayedColumns: string[] = ['ID', 'ROLE', 'USERNAME', 'CREATED_AT', 'ACTIONS'];
  dataSource = new MatTableDataSource(this.users);
  roleFilter?: string = 'clear';
  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};
  @ViewChild(MatSort) sort: MatSort = <MatSort>{};
  constructor(private userService: UserService, private medicService: MedicService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    
  }

  ngOnInit(): void {
    this.refreshData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    this.dataSource.sortingDataAccessor = (item: any, property) => {
      return item[property];
    };
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
      default:
        this.dataSource.data = users;
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.dataSource.sort = this.sort;
    }
  }

  refreshData() {
    this.userService.getAllUsers().subscribe((users: User[]) => {
      this.users = users;
      this.filterChange({ value: this.roleFilter });
    });

    this.medicService.getAllMedics().subscribe((medics: Medic[]) => {
      this.medics = medics;
    });
  }

  deleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to delete this user?',
      } as ConfirmDialogData,
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // User clicked 'Yes', proceed with deletion
        this.userService.deleteUser(user).subscribe(
          () => {
            // Handle successful deletion
            this.refreshData();
          },
        );
      }
    });
  }
  
  async addUser() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: {
        user: {},
        medic: null,
        allMedics: this.medics,
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      const { user, details } = result;
  
      // Check if the username already exists
      this.userService.isUserExists(user.username).subscribe((exists: boolean) => {
        if (exists) {
          // Display an error message or handle the situation where the username already exists
          this.snackBar.open('Utilizatorul ' + user.username + ' exista deja.', 'close', {
            duration: 2000,
            panelClass: 'errorSnack',
          });
        } else {
          // Username is unique, proceed with user addition
          this.userService.addUser(user).subscribe(() => {
            if (user.role === Role.Admin) {
              this.refreshData();
            }
  
            this.userService.getLastId().subscribe(async (id: number) => {
              details.useR_ID = id;
              
              const userRole = parseInt(user.role, 10); // Convert user.role to a number

              if (userRole === Role.Medic) {                
                await this.medicService.addMedic(<Medic>details).toPromise();
                this.refreshData();
              }
            });
          });
        }
      });
    });
  }

  editUser(user: User) {
    const medic = this.medics.find((m) => m.useR_ID === user.id) || null;

    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: {
        user,
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
      });
    });
  }
}
function displayPassword() {
  throw new Error('Function not implemented.');
}

