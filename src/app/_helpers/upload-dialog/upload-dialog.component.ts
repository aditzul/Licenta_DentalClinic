import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent implements OnInit {
  file: File | null = null;
  documentUploadForm!: FormGroup;
  documenteSelect: string[] = ['Act Identitate', 'Contract', 'Factura'];
  imagisticaSelect: string[] = ['Radiografie', 'RMN', 'Ecografie'];
  uploadData: any;

  constructor(
    public dialogRef: MatDialogRef<UploadDialogComponent>,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: UploadDialogData
  ) {}

  ngOnInit(): void {
    this.documentUploadForm = new FormGroup({
      fileTypeSelection: new FormControl(null, Validators.required),
      file: new FormControl(null, Validators.required)
    });
  }

  onFileSelected(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
      this.documentUploadForm.patchValue({ file: this.file });
    }
  }

  onYesClick(): void {
    if (this.documentUploadForm.valid) {
        const uploadData = {
          patient_id: this.data.patient_id,
          file_name: this.file?.name,
          file_type: this.file?.type,
          file_category: this.data.fileType,
          file_selected: this.documentUploadForm.get('fileTypeSelection')?.value,
          file: this.file,
        }

      this.dialogRef.close(uploadData);
    }
  }

  openFileDialog() {
    // Simulăm clicul pe inputul de fișier ascuns
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  }
}

export interface UploadDialogData {
  title: string;
  fileType: string;
  patient_id: number;
}
