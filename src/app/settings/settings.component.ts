import { Component, ViewChild } from '@angular/core';
import { SimpleAddDialogComponent, SimpleAddDialogData } from '../_helpers/simple-add-dialog/simple-add-dialog.component';
import { WorksService } from '../_services/works.service';
import { MatDialog } from '@angular/material/dialog';
import { DiseasesService } from '../_services/diseases.service';
import { SettingsWorksComponent } from '../settings-works/settings-works.component';
import { SettingsConditionsComponent } from '../settings-conditions/settings-conditions.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  @ViewChild('worksTable', {static: false}) worksTable: SettingsWorksComponent = <SettingsWorksComponent>{};
  @ViewChild('conditionsTable', {static: false}) conditionsTable: SettingsConditionsComponent = <SettingsConditionsComponent>{};

  constructor(
    private worksService: WorksService,
    private diseasesService: DiseasesService,
    private dialog: MatDialog,
  ) {}

  addWork() {
    const dialogRef = this.dialog.open(SimpleAddDialogComponent, {
      data: {
        title: 'Adaugă intervenție',
        type: 'Intervenție',
        formControlName: 'work_name',
      } as SimpleAddDialogData,
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.worksService.addWork(result).subscribe(() => {
      this.refreshData('Work');
      });
    });
  }

  addCondition() {
    const dialogRef = this.dialog.open(SimpleAddDialogComponent, {
      data: {
        title: 'Adaugă afecțiune',
        type: 'Afecțiune',
        formControlName: 'disease_name',
      } as SimpleAddDialogData,
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.diseasesService.addDisease(result).subscribe(() => {
      this.refreshData('Condition');
      });
    });
  }

  private refreshData(type: string) {
    if(type == 'Work') {
      this.worksTable.refreshData();
    } else {
      this.conditionsTable.refreshData();
    }
  }
}
