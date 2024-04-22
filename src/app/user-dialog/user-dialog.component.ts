import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Role, User, UserDialog } from '../_models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
})
export class UserDialogComponent {
  user: User;
  isAdd: boolean;
  userForm!: FormGroup;
  submitted: boolean = false;

  constructor(public dialogRef: MatDialogRef<UserDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: UserDialog) {
    this.user = data.user;
    this.isAdd = !this.user.id;
  }

  ngOnInit() {

    console.log(this.user)

    this.userForm = new FormGroup({
      username: new FormControl(this.user.username || '', Validators.required),
      password: new FormControl('', Validators.required),
      role: new FormControl(this.user.role?.toString() || Role.Admin.toString(), Validators.required),
      first_name: new FormControl(this.user.first_name || '', Validators.required),
      last_name: new FormControl(this.user.last_name || '', Validators.required),
      phone: new FormControl(this.user.phone || '', Validators.required),
    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.submitted = true;
    const user: User = {};

    if (!this.isAdd) {
      Object.assign(user, this.user);
    }

    // User Form
    user.username = this.userForm.controls['username'].value;
    user.password = this.userForm.controls['password'].value;
    user.role = this.userForm.controls['role'].value;
    user.first_name = this.userForm.controls['first_name'].value;
    user.last_name = this.userForm.controls['last_name'].value;
    user.phone = this.userForm.controls['phone'].value;

    this.dialogRef.close({
      user
    });
  }

  isDisabled() {
    if (this.userForm.controls['role'].value !== '0' && this.userForm.status === 'INVALID') {
      return true;
    }
    return false;
  }
}
