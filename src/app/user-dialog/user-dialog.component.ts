import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Role, User, UserDialog } from '../_models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Patient } from '../_models/patient';
import { Medic } from '../_models/medic';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
})
export class UserDialogComponent {
  user: User;
  patient: Patient | null;
  medic: Medic | null;
  allMedics: Medic[] = [];
  isAdd: boolean;
  userForm!: FormGroup;
  detailsForm!: FormGroup;
  submitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDialog
  ) {
    this.user = data.user;
    this.patient = data.patient;
    this.medic = data.medic;
    this.allMedics = data.allMedics;
    this.isAdd = Object.keys(this.user).length === 0;
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
      case Role.Patient:
        cd = this.patient;
        break;
      default:
        cd = {};
    }

    this.userForm = new FormGroup({
      username: new FormControl(this.user.email || '', Validators.required),
      password: new FormControl(this.user.password || '', Validators.required),
      role: new FormControl(
        this.user.role?.toString() || Role.Admin.toString(),
        Validators.required
      ),
    });

    // TODO:
    // let initialAssignationCode = cd?.assignatioN_CODE;
    // if (!initialAssignationCode) {
    //   initialAssignationCode = this.allMedics[0].assignatioN_CODE || '';
    // }

    this.detailsForm = new FormGroup({
      fullname: new FormControl(cd?.fullname || '', Validators.required),
      age: new FormControl(cd?.age || '', Validators.required),
      sex: new FormControl(cd?.sex || 'm', Validators.required),
      address: new FormControl(cd?.address || '', Validators.required),
      phone: new FormControl(cd?.phone || '', Validators.required),
      email: new FormControl(cd?.email || '', Validators.required),
      assignatioN_CODE: new FormControl(
        ' ',
        Validators.required
      ),
      occupation: new FormControl(cd?.occupation || ' ', Validators.required),
      cnp: new FormControl(cd?.cnp || ' ', Validators.required),
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
    user.email = this.userForm.controls['username'].value;
    user.password = this.userForm.controls['password'].value;
    user.role = this.userForm.controls['role'].value;

    //detailsForm
    const currentRole = user.role;
    if (currentRole != Role.Admin) {
      details.useR_ID = user.id;
      details.fullname = this.detailsForm.controls['fullname'].value;
      details.age = this.detailsForm.controls['age'].value;
      details.sex = this.detailsForm.controls['sex'].value;
      details.address = this.detailsForm.controls['address'].value;
      details.phone = this.detailsForm.controls['phone'].value;
      details.email = this.detailsForm.controls['email'].value;
      details.assignatioN_CODE =
        this.detailsForm.controls['assignatioN_CODE'].value;

      if (currentRole == Role.Medic) {
        details.id = this.medic?.id;
        details.occupation = this.detailsForm.controls['occupation'].value;
      }

      if (currentRole == Role.Patient) {
        details.id = this.patient?.id;
        details.cnp = this.detailsForm.controls['cnp'].value;
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

    if (
      this.userForm.controls['role'].value !== '0' &&
      this.detailsForm.status === 'INVALID'
    ) {
      return true;
    }

    return false;
  }
}
