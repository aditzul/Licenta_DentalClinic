import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Role, User, UserDialog } from '../_models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Medic } from '../_models/medic';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
})
export class UserDialogComponent {
  user: User;
  medic: Medic | null;
  allMedics: Medic[] = [];
  isAdd: boolean;
  userForm!: FormGroup;
  detailsForm!: FormGroup;
  submitted: boolean = false;

  constructor(public dialogRef: MatDialogRef<UserDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: UserDialog) {
    this.user = data.user;
    this.medic = data.medic;
    this.allMedics = data.allMedics;
    this.isAdd = !this.user.id; // Assuming user.id is the identifier for an existing user
  }

  ngOnInit() {
    let cd: any;

    switch (this.user.role) {
      case Role.Admin:
        cd = {};
        break;
      case Role.Medic:
        cd = this.medic;
        break;
      default:
        cd = {};
    }

    this.userForm = new FormGroup({
      username: new FormControl(this.user.username || '', Validators.required),
      password: new FormControl(this.user.password || '', Validators.required),
      role: new FormControl(this.user.role?.toString() || Role.Admin.toString(), Validators.required),
    });

    this.detailsForm = new FormGroup({
      FIRST_NAME: new FormControl(cd?.FIRST_NAME || '', Validators.required),
      LAST_NAME: new FormControl(cd?.LAST_NAME || '', Validators.required),
      AGE: new FormControl(cd?.AGE || '', Validators.required),
      SEX: new FormControl(cd?.SEX || 'M', Validators.required),
      ADDRESS: new FormControl(cd?.ADDRESS || '', Validators.required),
      PHONE: new FormControl(cd?.PHONE || '', Validators.required),
      USERNAME: new FormControl(cd?.USERNAME || '', Validators.required),
      CNP: new FormControl(cd?.CNP || ' ', Validators.required),
      MEDIC_ID: new FormControl(this.allMedics.length > 0 ? this.allMedics[0].id : ''),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.submitted = true;
    const details: any = {};

    const user: User = {};

    if (!this.isAdd) {
      Object.assign(user, this.user);
    }

    // User Form
    user.username = this.userForm.controls['username'].value;
    user.password = this.userForm.controls['password'].value;
    user.role = this.userForm.controls['role'].value;

    // detailsForm
    const currentRole = user.role;
    if (currentRole != Role.Admin) {
      details.useR_ID = user.id;
      details.fullname = this.detailsForm.controls['fullname'].value;
      details.AGE = this.detailsForm.controls['age'].value;
      details.sex = this.detailsForm.controls['sex'].value;
      details.address = this.detailsForm.controls['address'].value;
      details.PHONE = this.detailsForm.controls['phone'].value;
      details.EMAIL = this.detailsForm.controls['email'].value;

      if (currentRole == Role.Medic) {
        details.id = this.medic?.id;
      }
    }

    this.dialogRef.close({
      user,
      details,
    });
  }

  isDisabled() {
    if (this.userForm.status === 'INVALID') {
      return true;
    }

    if (this.userForm.controls['role'].value !== '0' && this.detailsForm.status === 'INVALID') {
      return true;
    }

    return false;
  }
}
