import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { WorksService } from 'src/app/_services/works.service';

@Component({
  selector: 'app-teeth-add-history-dialog',
  templateUrl: './teeth-add-history-dialog.component.html',
  styleUrls: ['./teeth-add-history-dialog.component.scss']
})
export class TeethAddHistoryDialogComponent implements OnInit{
  inputData: any = {};
  isAdd: boolean | undefined;
  teethAddHistoryForm!: FormGroup;
  submitted: boolean = false;
  allWorks: any = {};

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<TeethAddHistoryDialogComponent>,
    private worksService: WorksService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.inputData = this.data.tooth_id
    this.worksService.getAllWorks().subscribe((result: any) => {
      this.allWorks = result;
      //this.isAdd = !this.allWorks.work_name
      console.log(this.allWorks)
      this.initializeForm();
    })
  }

  initializeForm() {
    this.teethAddHistoryForm = new FormGroup({
      work_id: new FormControl(this.allWorks.work_name || '', Validators.required),
      comment: new FormControl(''),
    });
  }

  addWork() {

  }
}
