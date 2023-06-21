import { User } from './../_models/user';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { ApiError } from '../_models/error';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = [
    'id',
    'username',
    'role',
    'createD_AT',
    'actions',
  ];
  dataSource = new MatTableDataSource(this.users);
  constructor(
    private userService: UserService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.dataSource.data = users;
      },
      error: (error: ApiError) => {
        this._snackBar.open(error.message || error.title, 'Dismiss');
      },
    });
  }

  deleteUser(user: User) {
    this.userService.deleteUser(user).subscribe({
      next: (data) => {
        this.getAllUsers()
      },
      error: (error: ApiError) => {
        this._snackBar.open(error.message || error.title, 'Dismiss');
      },
    });
  }

  addUser() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.userService.addUser(result).subscribe(() => {
        this.getAllUsers();
      });
    });
  }

  editUser(user: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.userService.updateUser(result).subscribe(() => {
        this.getAllUsers();
      });
    });
  }
}
