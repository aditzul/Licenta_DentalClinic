import { Component, OnInit, ViewChild } from '@angular/core';
import { PatientService } from '../_services/patient.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicService } from '../_services/medic.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Patient, PatientComment, PatientHistory } from '../_models/patient';
import { Medic } from '../_models/medic';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent, ConfirmDialogData } from '../_helpers/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PatientDialogComponent } from '../patient-dialog/patient-dialog.component';


@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss'],
})
export class PatientDetailsComponent implements OnInit {
  patient: Patient = {};
  medic: Medic = {};
  displayedColumns: string[] = ['id', 'hospital', 'intervention', 'interventioN_DATE', 'actions'];
  comments: PatientComment[] = [];
  medicalHistory: MatTableDataSource<PatientHistory> = new MatTableDataSource<PatientHistory>();
  graphsError = false;
  newComment = '';
  loadingComment = false;
  loadingHistory = false;
  newHistory = {
    hospital: '',
    intervention: '',
    interventioN_DATE: '',
  };

  chartColors = {
    red: 'rgb(244, 67, 54)',
    blue: 'rgb(3,169,244)',
    purple: 'rgb(63, 81, 181)',
    black: 'rgb(0, 0, 0)',
  };

  public ekgChart: any;
  public tempChart: any;
  public pulseChart: any;

  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};
  medics: any

  constructor(
    private patientService: PatientService,
    private medicService: MedicService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,    
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const { userId } = params;
      this.getData(userId);
    });
  }

  ngAfterViewInit() {
    this.medicalHistory.paginator = this.paginator;
  }

  getData(userId: string) {
    this.patientService.getPatientById(userId).subscribe((patient: Patient) => {
      this.patient = patient;

      // Use MEDIC_ID directly from patient
      if (patient.medic_id) {
        // Use your existing service method to fetch the medic
        const medic_id = Number(patient.medic_id);
        this.medicService.getMedic({ id: medic_id }).subscribe((medic: Medic) => {
          this.medic = medic;
        });
      }

      this.getAllHistory();
      this.getAllComments();
    });
  }

  editPatient(patient: Patient) {
    const patientId: number = patient.id as number;
    
    this.patientService.getPatientById(patientId.toString()).subscribe(
      (patientDetails: Patient) => {
        const dialogRef = this.dialog.open(PatientDialogComponent, {
          data: {
            patient: patientDetails,
            allMedics: this.medics,
          },
        });
  
        dialogRef.afterClosed().subscribe((result) => {
          if (!result) return;
          const { patient, details } = result;
  
          this.patientService.updatePatient(patient).subscribe(() => {
            this.getData(patientId.toString());
          });
          this.patientService.updatePatient(<Patient>details).subscribe(() => {
            this.getData(patientId.toString());
          });
        });
      },
      (error) => {
        console.error('Error fetching patient details:', error);
      }
    );
  }

  addNewHistory() {
    this.loadingHistory = true;
    const { hospital, intervention, interventioN_DATE } = this.newHistory;

    if (hospital && intervention && interventioN_DATE) {
      const history = Object.assign(this.newHistory, {
        patienT_ID: this.patient.id,
      });
      this.patientService.AddMedicalDataByPatientId(<PatientHistory>history).subscribe((data) => {
        this.loadingHistory = false;
        this.newHistory.hospital = '';
        this.newHistory.interventioN_DATE = '';
        this.newHistory.intervention = '';

        this.getAllHistory();
      });
    } else {
      alert('invalid fields on history, check console');
      console.log('hospital: ', hospital);
      console.log('intervention: ', intervention);
      console.log('interventioN_DATE: ', interventioN_DATE);
    }
  }

  getAllHistory() {
    this.patientService.getMedicalDataByPatientId(this.patient).subscribe((history) => {
      this.medicalHistory.data = history;
    });
  }

  addNewComment() {
    this.loadingComment = true;

    const comment = {
      patienT_ID: this.patient.id,
      MEDIC_ID: this.medic.id,
      comment: this.newComment,
      commenT_TYPE: true,
    };
    if (comment.comment == '') {
      this.snackBar.open('Nu poti adauga un comentariu gol.', 'close', {
        duration: 2000,
        panelClass: 'errorSnack',
      });
    } else {
      this.patientService.AddComment(<PatientComment>comment).subscribe((data) => {
        this.getAllComments();
        this.loadingComment = false;
        this.newComment = '';
      });
    }
  }

  deleteComment(comment: PatientComment) {
    this.loadingComment = true;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to delete this comment?',
      } as ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // User clicked 'Yes', proceed with deletion
        this.patientService.deleteComment(comment.id).subscribe(
          () => {
            this.getAllComments();
            this.loadingComment = false;
          },
        );
      }
    });
  }

  getAllComments() {
    this.patientService.GetAllCommentsByPatientID(this.patient).subscribe((comments) => {
      this.comments = comments;
    });
  }
}
