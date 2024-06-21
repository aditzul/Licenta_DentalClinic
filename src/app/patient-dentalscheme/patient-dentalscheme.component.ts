import { Component } from '@angular/core';
import { PatientService } from '../_services/patient.service';
import { Patient } from '../_models/patient';
import { ActivatedRoute } from '@angular/router';
import { Tooth, ToothDraw } from '../_models/patient'
import { MatDialog } from '@angular/material/dialog';
import { TeethHistoryDialogComponent } from '../_helpers/teeth-history-dialog/teeth-history-dialog.component';


@Component({
  selector: 'app-patient-dentalscheme',
  templateUrl: './patient-dentalscheme.component.html',
  styleUrls: ['./patient-dentalscheme.component.scss']
})

export class PatientDentalschemeComponent {
  teeth: Tooth[] = [];
  teethDraw: ToothDraw[] = [];
  selectedTooth: string | null = null;
  patients: Patient[] = [];
  result: any = {};

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const { userId } = params;
      this.patientService.getTeethHistoryByPatientID(userId).subscribe((result: any) => {
        this.result = result;
        this.generateTeeth();
      })
    });
  }

  generateTeeth() {
    const toothWidth = 40;
    const spacing = 12;
    const svgWidth = 800;
  
    const topY = 90;
    const bottomY = 260;
    const leftStartX = -32;
    const rightStartX = 430;
  
    const resultIds = [];
    for (const key in this.result) {
      if (this.result.hasOwnProperty(key)) {
        resultIds.push(Number(this.result[key].tooth_id)); // Converteste string-ul la numar
      }
    }

    // Generare cadran stanga-sus (21 to 28)
    for (let i = 0; i < 8; i++) {
      const toothId = `${18 - i}`;
      const touched = resultIds.includes(Number(toothId));
      let extracted = 0;
      for (const key in this.result) {
        if (this.result[key].tooth_id === Number(toothId) && this.result[key].extracted === 1) {
          extracted = 1;
          break;
        }
      }
      
      const toothData = {
        id: toothId,
        x: leftStartX + i * (toothWidth + spacing),
        y: topY,
        touched: touched,
        extracted: extracted
      };
      this.teethDraw.push(toothData);
    }    
  
    // Generate top-right quadrant (21 to 28)
    for (let i = 0; i < 8; i++) {
      const toothId = `${21 + i}`;
      const touched = resultIds.includes(Number(toothId));
      let extracted = 0;
      for (const key in this.result) {
        if (this.result[key].tooth_id === Number(toothId) && this.result[key].extracted === 1) {
          extracted = 1;
          break;
        }
      }
      const toothData = {
        id: toothId,
        x: rightStartX + i * (toothWidth + spacing),
        y: topY,
        touched: touched,
        extracted: this.result[toothId]?.extracted || 0
      };
      this.teethDraw.push(toothData);
    }
  
    // Generate bottom-left quadrant (48 to 41)
    for (let i = 0; i < 8; i++) {
      const toothId = `${48 - i}`;
      const touched = resultIds.includes(Number(toothId));
      let extracted = 0;
      for (const key in this.result) {
        if (this.result[key].tooth_id === Number(toothId) && this.result[key].extracted === 1) {
          extracted = 1;
          break;
        }
      }
      const toothData = {
        id: toothId,
        x: leftStartX + i * (toothWidth + spacing),
        y: bottomY,
        touched: touched,
        extracted: this.result[toothId]?.extracted || 0
      };
      this.teethDraw.push(toothData);
    }
  
    // Generate bottom-right quadrant (31 to 38)
    for (let i = 0; i < 8; i++) {
      const toothId = `${31 + i}`;
      const touched = resultIds.includes(Number(toothId));
      let extracted = 0;
      for (const key in this.result) {
        if (this.result[key].tooth_id === Number(toothId) && this.result[key].extracted === 1) {
          extracted = 1;
          break;
        }
      }
      const toothData = {
        id: toothId,
        x: rightStartX + i * (toothWidth + spacing),
        y: bottomY,
        touched: touched,
        extracted: this.result[toothId]?.extracted || 0
      };
      this.teethDraw.push(toothData);
    }
  }
  

  selectTooth(tooth_id: number) {
    const selectedToothId = this.selectedTooth ? this.selectedTooth.toString() : null;
    this.selectedTooth = selectedToothId === tooth_id.toString() ? null : tooth_id.toString();
    this.route.params.subscribe((params) => {
      const patientID: number = +params['userId']
      const data = {
        patient_id: patientID,
        tooth_id: tooth_id,
      }
      const dialogRef = this.dialog.open(TeethHistoryDialogComponent, {
        data: data
      });
    });
  }
}