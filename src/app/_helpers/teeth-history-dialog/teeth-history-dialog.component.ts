import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Tooth } from '../../_models/patient';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog.component';
import { TeethAddHistoryDialogComponent } from '../teeth-add-history-dialog/teeth-add-history-dialog.component';

@Component({
  selector: 'app-teeth-history-dialog',
  templateUrl: './teeth-history-dialog.component.html',
  styleUrls: ['./teeth-history-dialog.component.scss']
})
export class TeethHistoryDialogComponent implements OnInit, AfterViewInit {
  teeth: Tooth[] = [];
  displayedColumns: string[] = ['work_name', 'comment', 'date', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<Tooth>();

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<TeethHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Verificăm dacă data conține mai multe intrări
    if (Object.keys(data).length > 0) {
      // Parcurgem fiecare intrare și le adăugăm la this.teeth
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          this.teeth.push(data[key]);
        }
      }
    }
  }

  ngOnInit(): void {
    if (this.data && typeof this.data.teeth === 'object') {
      this.teeth = Object.values(this.data.teeth);
    } else {
      this.teeth = this.data;
    }
    this.dataSource.data = this.teeth;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item: any, property) => {
      return item[property];
    };
  }

  deleteHistory(tooth: { id: any; }) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmare',
        message: 'Ești sigur că vrei să ștergi această intrare?',
      } as ConfirmDialogData,
    });
    console.log(tooth.id)
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // User clicked 'Yes', proceed with deletion
        // this.userService.deleteUser(user).subscribe(
        //   () => {
        //     // Handle successful deletion
        //     this.refreshData();
        //   },
        // );
      }
    });
  }

  async addHistory() {
    const dialogRef = this.dialog.open(TeethAddHistoryDialogComponent, {
      data: {
        tooth_id: this.data.tooth_id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // if (!result) return;
      // const { user, details } = result;
      // this.userService.addUser(user).subscribe(() => {
      // this.refreshData();
      // });
    });
  }

  editHistory(ID: number) {
    // const dialogRef = this.dialog.open(UserDialogComponent, {
    //   data: {
    //     user,
    //   },
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (!result) return;
    //   const { user, details } = result;

    //   this.userService.updateUser(user).subscribe(() => {
    //     this.refreshData();
    //   });
    // });
  }
}
