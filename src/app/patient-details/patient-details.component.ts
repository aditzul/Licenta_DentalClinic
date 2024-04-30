import { Component, OnInit, ViewChild } from '@angular/core';
import { PatientService } from '../_services/patient.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Patient, PatientComment, PatientHistory } from '../_models/patient';
import { User } from '../_models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent, ConfirmDialogData } from '../_helpers/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PatientDialogComponent } from '../patient-dialog/patient-dialog.component';
import { UserService } from '../_services/user.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByDay'
})
export class FilterByDayPipe implements PipeTransform {
  transform(comments: PatientComment[]): { [key: string]: PatientComment[] } {
    const commentsByDay: { [key: string]: PatientComment[] } = {};

    comments.forEach(comment => {
      const date = new Date(comment.created_at).toDateString();
      if (!commentsByDay[date]) {
        commentsByDay[date] = [];
      }
      commentsByDay[date].push(comment);
    });

    return commentsByDay;
  }
}
@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss'],
})
export class PatientDetailsComponent implements OnInit {
  patient: Patient = {};
  medic: User = {};
  displayedColumns: string[] = ['id', 'hospital', 'intervention', 'interventioN_DATE', 'actions'];
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
  comments: PatientComment[] = [];
  commentsByDay: { [key: string]: PatientComment[] } = {};
  uniqueDays: string[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};
  medics: any;
Object: any;

  constructor(
    private patientService: PatientService,
    private userService: UserService,
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
        this.userService.getUser({ id: medic_id }).subscribe((medic: User) => {
          this.medic = medic;
        });
      }

      this.getAllComments();
      this.getAllHistory();
      console.log(this.commentsByDay)
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
        patient_id: this.patient.id,
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
      patient_id: this.patient.id,
      comment: this.newComment,
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
      this.commentsByDay = this.groupCommentsByDay(comments);
    });
  }
  
  groupCommentsByDay(comments: PatientComment[]): { [key: string]: PatientComment[] } {
    const groupedComments: { [key: string]: PatientComment[] } = {};
    comments.forEach(comment => {
      const commentDate = new Date(comment.created_at);
      const dayKey = commentDate.toLocaleDateString('ro-RO');
      if (!groupedComments[dayKey]) {
        groupedComments[dayKey] = [];
      }
      groupedComments[dayKey].push(comment);
    });
    return groupedComments;
  }
}
