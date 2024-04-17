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
  //medic: Medic | null;
  //allMedics: Medic[] = [];
  isAdd: boolean;
  userForm!: FormGroup;
  // detailsForm!: FormGroup;
  submitted: boolean = false;

  constructor(public dialogRef: MatDialogRef<UserDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: UserDialog) {
    this.user = data.user;
    //this.medic = data.medic;
    //this.allMedics = data.allMedics;
    this.isAdd = !this.user.id; // Assuming user.id is the identifier for an existing user
  }

  ngOnInit() {
    // let cd: any;

    // switch (this.user.role) {
    //   case Role.Admin:
    //     cd = {};
    //     break;
    //   case Role.Medic:
    //     cd = this.user;
    //     break;
    //   default:
    //     cd = {};
    // }

    this.userForm = new FormGroup({
      username: new FormControl(this.user.username || '', Validators.required),
      password: new FormControl('', Validators.required),
      role: new FormControl(this.user.role?.toString() || Role.Admin.toString(), Validators.required),
      first_name: new FormControl(this.user.first_name || '', Validators.required),
      last_name: new FormControl(this.user.last_name || '', Validators.required),
      phone: new FormControl(this.user.phone || '', Validators.required),
    });

    // this.detailsForm = new FormGroup({
    //   first_name: new FormControl(cd?.first_name || '', Validators.required),
    //   last_name: new FormControl(cd?.last_name || '', Validators.required),
    //   phone: new FormControl(cd?.phone || '', Validators.required),
    // });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.submitted = true;
    // const details: any = {};

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

    // detailsForm
    // const currentRole = user.role;
    // if (currentRole != Role.Admin) {
    //   details.id = user.id;
    //   details.first_name = this.detailsForm.controls['first_name'].value;
    //   details.last_name = this.detailsForm.controls['last_name'].value;
    //   details.phone = this.detailsForm.controls['phone'].value;

    //   if (currentRole == Role.Medic) {
    //     details.id = this.medic?.id;
    //   }
    // }

    this.dialogRef.close({
      user,
      // details,
    });
  }

  isDisabled() {
    if (this.userForm.controls['role'].value !== '0' && this.userForm.status === 'INVALID') {
      return true;
    }
    return false;
  }
}
