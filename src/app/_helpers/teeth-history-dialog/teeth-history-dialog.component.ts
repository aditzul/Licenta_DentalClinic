import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Tooth } from '../../_models/patient';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog.component';
import { TeethAddHistoryDialogComponent } from '../teeth-add-history-dialog/teeth-add-history-dialog.component';
import { PatientService } from './../../_services/patient.service'; // Asigură-te că ai importat serviciul pacientului

@Component({
  selector: 'app-teeth-history-dialog',
  templateUrl: './teeth-history-dialog.component.html',
  styleUrls: ['./teeth-history-dialog.component.scss']
})
export class TeethHistoryDialogComponent implements OnInit, AfterViewInit {
  teeth: Tooth[] = [];
  displayedColumns: string[] = ['work_name', 'comment', 'created_at', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<Tooth> = new MatTableDataSource<Tooth>();
  isExtracted: boolean = false; // Inițializează cu o valoare default

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<TeethHistoryDialogComponent>,
    private patientService: PatientService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.patientService.getTeethHistory(this.data.patient_id, this.data.tooth_id).subscribe((teethData: any) => {
      if (Array.isArray(teethData)) {
        this.teeth = teethData;
      } else if (typeof teethData === 'object' && teethData !== null) {
        // Dacă nu este array, verificăm dacă este un obiect și îl convertim într-o array
        this.teeth = Object.values(teethData);
      } else {
        console.warn('Invalid teeth data format:', teethData);
        this.teeth = []; // În caz de format invalid, inițializăm cu array goală
      }
      
      this.dataSource.data = this.teeth;

      this.checkIfExtracted(); // Apelăm funcția după ce obținem datele
    }, error => {
      console.error('Error fetching teeth history:', error);
      this.teeth = []; // În caz de eroare, asigurăm teeth este o array goală
      this.dataSource.data = this.teeth;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item: any, property) => {
      return item[property];
    };
  }

  checkIfExtracted() {
    if (Array.isArray(this.teeth)) {
      this.isExtracted = this.teeth.some(tooth => tooth.extracted === 1);
    } else {
      console.warn('Teeth data is not an array:', this.teeth);
      this.isExtracted = false; // Poți seta isExtracted cum consideri necesar în caz de eroare
    }
  }

  async addHistory() {
    const dialogRef = this.dialog.open(TeethAddHistoryDialogComponent, {
      data: {
        isAdd: true,
        tooth_id: this.data.tooth_id,
        patient_id: this.data.patient_id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.patientService.addTeethHistory(result).subscribe(() => {
        this.getData(); // Reîncărcăm datele după adăugare
      }, error => {
        console.error('Error adding teeth history:', error);
      });
    });
  }

  editHistory(tooth: { id: any }) {
    const dialogRef = this.dialog.open(TeethAddHistoryDialogComponent, {
      data: {
        isAdd: false,
        tooth: tooth,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      const body = {
        id: result.details.id,
        dental_work_id: result.details.dental_work_id,
        comment: result.details.comment,
        extracted: result.details.extracted,
      };
      this.patientService.editTeethHistory(body).subscribe(() => {
        this.getData(); // Reîncărcăm datele după editare
      }, error => {
        console.error('Error editing teeth history:', error);
      });
    });
  }

  deleteHistory(tooth: { id: any }) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmare',
        message: 'Ești sigur că vrei să ștergi această intrare?',
      } as ConfirmDialogData,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // User clicked 'Yes', proceed with deletion
        this.patientService.deleteTeethHistory(tooth.id).subscribe(
          () => {
            // Handle successful deletion
            this.getData(); // Reîncărcăm datele după ștergere
          },
          error => {
            console.error('Error deleting teeth history:', error);
          }
        );
      }
    });
  }

  onClose(result?: any): void {
    this.dialogRef.close(result);
  }
}
