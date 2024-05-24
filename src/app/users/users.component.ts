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
  visibleRowIndex: number = -1;
  displayedColumns: string[] = ['id', 'role', 'username', 'full_name', 'created_at', 'actions'];
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
    this.userService.getAllUsers().subscribe((data: any) => {
      this.users = data;
      this.filterChange({ value: this.roleFilter });
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
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      const { user, details } = result;
      this.userService.addUser(user).subscribe(() => {
      this.refreshData();
      });
    });
  }

  editUser(user: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: {
        user,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      const { user, details } = result;

      this.userService.updateUser(user).subscribe(() => {
        this.refreshData();
      });
    });
  }
}

