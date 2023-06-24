import { PatientComment, PatientHistory, SensorSessionData } from './../_models/patient';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Patient } from '../_models/patient';
import { Medic } from '../_models/medic';
import { PatientService } from '../_services/patient.service';
import { ActivatedRoute } from '@angular/router';
import { MedicService } from '../_services/medic.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Chart } from 'chart.js';
import { color, each } from 'chart.js/helpers';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss'],
})
export class PatientDetailsComponent implements OnInit {
  patient: Patient = {};
  medic: Medic = {};
  sensorSessionData: SensorSessionData[] = [];
  loaded = false;
  displayedColumns: string[] = ['id', 'temperatureAvg', 'heartAvg', 'EKGAvg', 'createD_AT', 'actions'];
  dataSource = new MatTableDataSource(this.sensorSessionData);
  selectedSession: SensorSessionData = <SensorSessionData>{};
  comments: PatientComment[] = [];
  medicalHistory: PatientHistory[] = [];
  graphsError = false;
  newComment = '';
  loadingComment = false;

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
  constructor(private patientService: PatientService, private medicService: MedicService, private route: ActivatedRoute, private datePipe: DatePipe) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const { userId } = params;

      this.getData(userId);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getData(userId: string) {
    this.patientService.getPatientByUserId(userId).subscribe((patient: Patient) => {
      this.patient = patient;

      this.medicService.getMedicByAssignCode(<string>patient.assignatioN_CODE).subscribe((medic: Medic) => {
        this.patient = patient;
        this.medic = medic;
      });

      this.patientService.getSensorDataByPatientId(patient).subscribe((data: SensorSessionData[]) => {
        this.sensorSessionData = data;
        this.dataSource.data = data;
        this.graphsError = !data || data['length'] === 0;
        this.loaded = true;
        this.showSensorData(data[0]);
      });

      this.patientService.getMedicalDataByPatientId(patient).subscribe((history) => {
        this.medicalHistory = history;
      });

      this.getAllComments();
    });
  }

  addNewComment() {
    this.loadingComment = true;

    const comment = {
      patienT_ID: this.patient.id,
      mediC_ID: this.medic.id,
      comment: this.newComment,
      commenT_TYPE: true,
    }

    this.patientService.addCommentDataByPatientId(<PatientComment>comment).subscribe(data => {
      this.getAllComments();
      this.loadingComment = false;
      this.newComment = ''
    })
  }

  getAllComments() {
    this.patientService.getCommentDataByPatientId(this.patient).subscribe((comments) => {
      this.comments = comments;
    });
  }

  showSensorData(data: SensorSessionData) {
    this.selectedSession = data;

    each(Chart.instances, function (instance) {
      instance.destroy();
    });
    this.createEkgChart();
    this.createTempPulseChart();
  }

  createTempPulseChart() {
    if (!this.selectedSession) return;

    const tempDataSet = this.selectedSession.session.map((point) => point.temperature);
    const pulseDataSet = this.selectedSession.session.map((point) => point.pulse);
    const labels = this.selectedSession.session.map((point) => this.datePipe.transform(point.createD_AT, 'HH:mm:ss'));

    this.tempChart = new Chart('tempChart', {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Temperature',
            backgroundColor: this.chartColors.blue,
            borderColor: this.chartColors.black,
            fill: false,
            data: tempDataSet,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: `Temperature Chart for entry ID ${this.selectedSession.entrY_ID}`,
          },
        },
      },
    });

    this.pulseChart = new Chart('pulseChart', {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Pulse',
            backgroundColor: this.chartColors.red,
            borderColor: this.chartColors.black,
            fill: false,
            data: tempDataSet,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        responsive: true,

        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: `Heartrate Chart for entry ID ${this.selectedSession.entrY_ID}`,
          },
        },
      },
    });
  }

  createEkgChart() {
    if (!this.selectedSession) return;

    this.ekgChart = new Chart('ekgChart', {
      type: 'line',
      data: {
        labels: this.selectedSession.session.map((point) => this.datePipe.transform(point.createD_AT, 'HH:mm:ss')),
        datasets: [
          {
            label: `Entry ID: ${this.selectedSession.entrY_ID}`,
            backgroundColor: color(this.chartColors.purple).rgbString(),
            borderColor: this.chartColors.black,
            fill: false,
            data: this.selectedSession.session.map((point) => point.ekg),
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: `EKG Chart for entry ID ${this.selectedSession.entrY_ID}`,
          },
        },
      },
    });
  }
}
