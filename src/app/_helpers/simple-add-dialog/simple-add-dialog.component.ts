import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Work } from 'src/app/_models/settings';
import { Disease } from 'src/app/_models/settings';

@Component({
  selector: 'app-simple-add-dialog',
  templateUrl: './simple-add-dialog.component.html',
  styleUrls: ['./simple-add-dialog.component.scss']
})
export class SimpleAddDialogComponent implements OnInit {
  work: Work | undefined;
  condition: Disease | undefined;
  addForm!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<SimpleAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SimpleAddDialogData
  ) {}

  ngOnInit(): void {
    this.addForm = new FormGroup({
      simpleAddFormField: new FormControl('', Validators.required),
    });
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    let data: string;

    data = this.addForm.controls['simpleAddFormField'].value;
    this.dialogRef.close({
      data
    });
  }

  isDisabled() {
    if (this.addForm.controls['simpleAddFormField'].value == '' && this.addForm.status === 'INVALID') {
      return true;
    }
    return false;
  }
}


export interface SimpleAddDialogData {
  title: string;
  type: string;
  formControlName: string;
}