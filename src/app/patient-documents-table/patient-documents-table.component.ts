import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { ConfirmDialogComponent, ConfirmDialogData } from '../_helpers/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PatientService } from '../_services/patient.service';

interface Document {
  id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  created_at: string;
}

@Component({
  selector: 'app-patient-documents-table',
  templateUrl: './patient-documents-table.component.html',
  styleUrls: ['./patient-documents-table.component.scss']
})
export class PatientDocumentsTableComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() documents: Document[] = [];
  displayedColumns: string[] = ['file_nice_name', 'created_at', 'actions'];
  dataSource: MatTableDataSource<Document> = new MatTableDataSource<Document>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  constructor(
    public dialog: MatDialog,
    private patientService: PatientService,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documents'] && changes['documents'].currentValue) {
      this.dataSource.data = changes['documents'].currentValue;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    }
  }

  deleteDocument(document: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to delete this patient?',
      } as ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.patientService.deletePatient(document).subscribe(
          () => {
            this.dataSource.data = this.dataSource.data.filter(p => p.id !== document.id);
          },
        );
      }
    });
  }

  viewDocument(document: Document): void {
    const url = `${environment.uploadsPath}${document.file_path}`;
    window.open(url, '_blank');
  }

}
