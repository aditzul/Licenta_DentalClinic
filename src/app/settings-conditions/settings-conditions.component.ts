import { Component, OnInit, ViewChild } from '@angular/core';
import { Disease } from '../_models/settings';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DiseasesService } from '../_services/diseases.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../_helpers/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-settings-conditions',
  templateUrl: './settings-conditions.component.html',
  styleUrls: ['./settings-conditions.component.scss']
})
export class SettingsConditionsComponent implements OnInit {

  conditions: Disease[] = [];
  displayedColumns: string[] = ['id', 'disease_name', 'actions'];
  title: 'Conditions' | undefined
  dataSource = new MatTableDataSource(this.conditions);
  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};

  constructor(
    private diseasesService: DiseasesService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.refreshData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  deleteCondition(condition: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmare',
        message: 'Ești sigur că vrei să ștergi această afecțiune?',
      } as ConfirmDialogData,
    });
  
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // User clicked 'Yes', proceed with deletion
        this.diseasesService.deleteDisease(condition.id).subscribe(
          () => {
            this.refreshData();
          },
        );
      }
    });
  }
  
  refreshData() {
    this.diseasesService.getAllDiseases().subscribe((conditions: Disease[]) => {
      this.conditions = conditions;
      this.dataSource.data = this.conditions;
    });
  }
}
