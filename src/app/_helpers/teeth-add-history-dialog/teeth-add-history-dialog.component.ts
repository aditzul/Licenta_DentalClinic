import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WorksService } from 'src/app/_services/works.service';

@Component({
  selector: 'app-teeth-add-history-dialog',
  templateUrl: './teeth-add-history-dialog.component.html',
  styleUrls: ['./teeth-add-history-dialog.component.scss']
})
export class TeethAddHistoryDialogComponent implements OnInit {
  isAdd: boolean = true;
  teethAddHistoryForm!: FormGroup;
  submitted: boolean = false;
  allWorks: any[] = [];
  isExtracted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<TeethAddHistoryDialogComponent>,
    private worksService: WorksService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.worksService.getAllWorks().subscribe((result: any) => {
      this.allWorks = result;
      this.initializeForm();
    });
    this.isAdd = this.data.isAdd;
  }

  initializeForm() {
    let initialWorkValue = null;

    if (this.data.tooth && this.data.tooth.work_name) {
      const selectedWork = this.allWorks.find(work => work.work_name === this.data.tooth.work_name);
      if (selectedWork) {
        initialWorkValue = { work_id: selectedWork.id, work_name: selectedWork.work_name };
      }
    }

    this.teethAddHistoryForm = new FormGroup({
      work: new FormControl(initialWorkValue, Validators.required),
      comment: new FormControl(this.data.tooth ? this.data.tooth.comment || '' : ''),
    });
  }

  compareWorkObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.work_id === o2.work_id && o1.work_name === o2.work_name : o1 === o2;
  }

  addWork() {
    this.submitted = true;
    const details: any = {};

    // Verifica daca are ID, atunci e Edit
    if(this.data.tooth){
      details.id = this.data.tooth.id
      details.tooth_id = this.data.tooth.tooth_id;
      details.patient_id = this.data.tooth.patient_id;
    } else {
      details.tooth_id = this.data.tooth_id;
      details.patient_id = this.data.patient_id;
    }
    details.comment = this.teethAddHistoryForm.get('comment')?.value;

    const selectedWork = this.teethAddHistoryForm.get('work')?.value;
    if (selectedWork) {
      details.dental_work_id = selectedWork.work_id;
      details.work_name = selectedWork.work_name;
      if(selectedWork.work_name === 'Extracție' || selectedWork.work_name === 'Extractie'){
        details.extracted = 1;
      } else {
        details.extracted = 0;
      }
    }

    this.dialogRef.close({
      details
    });
  }

  isDisabled() {
    if (this.teethAddHistoryForm.controls['work'].value !== '0' && this.teethAddHistoryForm.status === 'INVALID') {
      return true;
    }
    return false;
  }
}
