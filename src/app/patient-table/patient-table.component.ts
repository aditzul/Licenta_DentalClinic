import { Component, Input, OnInit } from '@angular/core';
import { Patient } from '../_models/patient';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.scss'],
})
export class PatientTableComponent implements OnInit {
  @Input() patients: Patient[] = [];
  @Input() isComplex = false;
  @Input() isEdit = false;
  @Input() title = ""

  simpleColumns: string[] = ['id', 'sex', 'fullname', 'age', 'createD_AT', 'actions'];
  complexColumns: string[] = ['id', 'sex', 'fullname', 'age', 'createD_AT', 'assignatioN_CODE', 'address', 'phone', 'email', 'cnp', 'actions'];
  displayedColumns = this.simpleColumns;

  dataSource = new MatTableDataSource(this.patients);

  constructor() {}

  ngOnInit() {
    // if (this.isComplex) {
    //   this.displayedColumns = this.complexColumns;
    // }

    this.dataSource.data = this.patients;
    // console.log(this.patients)
  }

  addPatient() {
    console.log('add P');
  }

  editPatient(patient: Patient) {
    console.log(patient);
  }

  deletePatient(patient: Patient) {
    console.log(patient);
  }
}
