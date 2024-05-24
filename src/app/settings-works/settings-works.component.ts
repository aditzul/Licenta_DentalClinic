import { Component, OnInit, ViewChild } from '@angular/core';
import { Work } from '../_models/settings';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { WorksService } from '../_services/works.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../_helpers/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-settings-works',
  templateUrl: './settings-works.component.html',
  styleUrls: ['./settings-works.component.scss']
})

export class SettingsWorksComponent implements OnInit {
  works: Work[] = [];
  displayedColumns: string[] = ['id', 'work_name', 'actions'];
  title: 'Lucrări' | undefined
  dataSource = new MatTableDataSource(this.works);
  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};

  constructor(
    private worksService: WorksService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.refreshData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

deleteWork(work: any) {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: {
      title: 'Confirmare',
      message: 'Ești sigur că vrei să ștergi această intervenție?',
    } as ConfirmDialogData,
  });

  dialogRef.afterClosed().subscribe((result: any) => {
    if (result) {
      // User clicked 'Yes', proceed with deletion
      this.worksService.deleteWork(work.id).subscribe(
        () => {
          this.refreshData();
        },
      );
    }
  });
}

refreshData() {
  this.worksService.getAllWorks().subscribe((works: Work[]) => {
    this.works = works;
    this.dataSource.data = this.works;
  });
}
}