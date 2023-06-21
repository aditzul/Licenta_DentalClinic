import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../_models/user';
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

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.user = data;
    this.isAdd = Object.keys(this.user).length === 0;
  }

  ngOnInit() {
    this.userForm = new FormGroup({
      username: new FormControl(this.user.email || '', Validators.required),
      password: new FormControl(this.user.password || '', Validators.required),
      role: new FormControl(this.user.role?.toString() || '0', Validators.required),
    });

    console.log('initial', this.userForm);
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

    user.email = this.userForm.controls['username'].value;
    user.password = this.userForm.controls['password'].value;
    user.role = this.userForm.controls['role'].value;

    this.dialogRef.close(user);
  }
}
