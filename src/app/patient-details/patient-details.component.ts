import { Component, OnInit, ViewChild } from '@angular/core';
import { PatientService } from '../_services/patient.service';
import { AppointmentService } from '../_services/appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Patient, PatientComment, PatientHistory } from '../_models/patient';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent, ConfirmDialogData } from '../_helpers/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PatientDialogComponent } from '../patient-dialog/patient-dialog.component';
import { UserService } from '../_services/user.service';
import { Pipe, PipeTransform } from '@angular/core';
import { UploadDialogComponent, UploadDialogData } from '../_helpers/upload-dialog/upload-dialog.component';
import {FormControl} from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';

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
  selected = new FormControl(0);
  patient: Patient = {};
  appointments: any[] = [];
  numConfirmedAppointments: number = 0;
  numCancelledAppointments: number = 0;
  futureAppointment: Date | null = null;
  displayedColumns: string[] = ['id', 'hospital', 'intervention', 'interventioN_DATE', 'actions'];
  medicalHistory: MatTableDataSource<PatientHistory> = new MatTableDataSource<PatientHistory>();
  graphsError = false;
  isEnabled: boolean | undefined;
  sms_send: number | undefined;
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
  filelist: any;

  constructor(
    private patientService: PatientService,
    private appointmentService: AppointmentService,
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

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
   if (tabChangeEvent.tab.textLabel == 'Imagistica') {
    this.getDocuments();
   } else if(tabChangeEvent.tab.textLabel == 'Documente') {
    this.getImagistica();
   }
  }

  getData(userId: string) {
    this.patientService.getPatientById(userId).subscribe((patient: Patient) => {
      this.patient = patient;
      const patientID: number = patient.id as number;
      this.isEnabled = this.patient.send_sms == 1 ? true : false;
      this.getAllComments();
      this.getPatientAppointments(patientID);
      //this.getAllHistory();
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
          const { details } = result;
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

  getPatientAppointments(patientID: number) {
    this.appointmentService.getAllAppointmentsByPatientID(patientID).subscribe((response: any) => {
        this.appointments = response.data[0]; // accesăm array-ul de întâlniri din obiectul data
        this.numConfirmedAppointments = this.appointments.filter(appointment => appointment.meta === 'Confirmat').length;
        this.numCancelledAppointments = this.appointments.filter(appointment => appointment.meta === 'Anulat').length;
        const now = new Date();
        const futureAppointments = this.appointments.filter(appointment => new Date(appointment.start) > now);
        if (futureAppointments.length > 0) {
          this.futureAppointment = new Date(futureAppointments[0].start);
        } else {
          this.futureAppointment = null; // Sau orice altă valoare pentru a indica lipsa unei programări viitoare
        }    
    });
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
      this.snackBar.open('Nu poti adauga un comentariu gol.', 'Închide', {
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

  uploadDocument(type: string) {
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      data: {
        title: 'Incarca document',
        fileType: type,
      } as UploadDialogData,
    });
  
    dialogRef.afterClosed().subscribe((file: File | null) => {
      if (file) {
        const patientInfo = {
          patient_id: this.patient.id,
          patient_folder: `${this.patient.id}_${this.patient.first_name}_${this.patient.last_name}`,
          document_type: type,
        };
        const formData = new FormData();
        formData.append('fileInfo', file); // Adaugă fișierul în FormData
        formData.append('patientInfo', JSON.stringify(patientInfo)); // Convertște obiectul patientInfo în JSON și îl adaugă în FormData 
        this.patientService.uploadDocument(formData).subscribe();
      }
    });
  }
  
  deleteComment(comment: PatientComment) {
    this.loadingComment = true;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmare',
        message: 'Esti sigur ca doresti sa stergi acest comentariu?',
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


  getDocuments() {
    const patientInfo = {
      patient_id: this.patient.id,
      patient_folder: `${this.patient.id}_${this.patient.first_name}_${this.patient.last_name}`,
      document_type: 'Documente',
    };

    this.patientService.getFilesList(patientInfo).subscribe((filelist: any) => {
      this.filelist = filelist;
      console.log('Documente', filelist)
    });
  }

  getImagistica() {
    const patientInfo = {
      patient_id: this.patient.id,
      patient_folder: `${this.patient.id}_${this.patient.first_name}_${this.patient.last_name}`,
      document_type: 'Imagistica',
    };

    this.patientService.getFilesList(patientInfo).subscribe((filelist: any) => {
      this.filelist = filelist;
      console.log('Imagistica', filelist)
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

  onToggleChange(event: any) {
    this.isEnabled = event.checked; // Actualizează valoarea isEnabled cu starea curentă a toggle-ului
    console.log(this.isEnabled);

    // Actualizează obiectul pacient cu noua valoare
    this.patient.send_sms = this.isEnabled ? 1 : 0;

    // Trimite actualizarea către server
    this.patientService.updatePatient(this.patient).subscribe(
      response => {
        console.log('Patient updated successfully', response);
      },
      error => {
        console.error('Error updating patient', error);
      }
    );
  }
}
