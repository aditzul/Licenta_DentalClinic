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
import { Pipe, PipeTransform } from '@angular/core';
import { UploadDialogComponent, UploadDialogData } from '../_helpers/upload-dialog/upload-dialog.component';
import {FormControl} from '@angular/forms';
import { SettingsService } from '../_services/settings.service';

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
  file: File | null | undefined
  selected = new FormControl(0);
  patient: Patient = {};
  patientData: any = {}; // Obiectul primit din serviciu
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
  comments: PatientComment[] = [];
  commentsByDay: { [key: string]: PatientComment[] } = {};
  uniqueDays: string[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};
  medics: any;
  Object: any;
  filelist: any;
  smsTemplate: any;

  constructor(
    private patientService: PatientService,
    private settingsService: SettingsService,
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const { userId } = params;
      this.getData(userId);
    });
  }

  getData(userId: string) {
    this.patientService.getPatientById(userId).subscribe((patient: Patient) => {
      this.patient = patient;
      const patientID: number = patient.id as number;
      this.isEnabled = this.patient.send_sms == 1 ? true : false;
      this.getAllComments();
      this.getPatientAppointments(patientID);
      this.loadFiles(patientID);
    });
  }


  loadFiles(userId: number) {
    this.patientService.getFilesList(userId).subscribe((result: any) => {
      this.patientData = result;
    });
  }

  ngAfterViewInit() {
    this.medicalHistory.paginator = this.paginator;
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

  getPatientAppointments(patientID: number) {
    this.appointmentService.getAllAppointmentsByPatientID(patientID).subscribe((response: any) => {
        this.appointments = response; // accesăm array-ul de întâlniri din obiectul data
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
      width: '300px',
      data: {
        title: 'Incarcă document',
        fileType: type,
        patient_id: this.patient.id,
      } as UploadDialogData,
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result.file) {
        const formData = new FormData();
        formData.append('fileInfo', result.file);
        formData.append('patientInfo', JSON.stringify(result));
        this.patientService.uploadDocument(formData).subscribe(() => {
          this.loadFiles(result.patient_id);
        });
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

  sendSMS(patient: Patient) {
    // Verificăm dacă this.futureAppointment este definit
    if (!this.futureAppointment) {
      this.snackBar.open('Eroare: Nu există o programare viitoare', 'Închide', {
        duration: 3000,
        panelClass: 'errorSnack',
      });
      return; // Întrerupem funcția dacă this.futureAppointment este null
    }
  
    // Continuăm cu formatarea datei și ora
    const formattedDateTime = this.formatDate(this.futureAppointment);
    console.log('Formatted DateTime:', formattedDateTime);
  
    // Restul logicii pentru trimiterea SMS-ului
    this.settingsService.getSMSSettings().subscribe((result) => {
      if (!result) return;
      this.smsTemplate = result[0].SMS_TEMPLATE;
      const data = {
        to: patient.phone,
        body: this.replacePlaceholders(this.smsTemplate, patient.first_name || '', formattedDateTime),
      };
      console.log(data);
  
      this.patientService.sendSMS(data).subscribe((result) => {
        console.log(result);
      });
    });
  }
  
  formatDate(date: Date): string {
    // Implementează logica pentru formatarea datei și orei așa cum ai nevoie
    const formattedDate = `${this.padZero(date.getDate())}.${this.padZero(
      date.getMonth() + 1
    )}.${date.getFullYear()}, ora ${this.padZero(date.getHours())}:${this.padZero(date.getMinutes())}`;
    return formattedDate;
  }
  
  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
  
  replacePlaceholders(template: string, patientName: string, dateTime: string): string {
    // Implementează logica pentru înlocuirea placeholder-urilor în șablonul SMS-ului
    template = template.replace('$PACIENT$', patientName);
    template = template.replace('$DATA_ORA$', dateTime);
    return template;
  }

  onToggleChange(event: any) {
    this.isEnabled = event.checked;
    this.patient.send_sms = this.isEnabled ? 1 : 0;
    this.patientService.updatePatient(this.patient).subscribe(
      response => {
      },
      error => {
        console.error('Error updating patient', error);
      }
    );
  }
}
