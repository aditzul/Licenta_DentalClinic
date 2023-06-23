import { MedicService } from './../_services/medic.service';
import { Component, OnInit } from '@angular/core';
import { PatientService } from '../_services/patient.service';
import { Patient, Sex } from '../_models/patient';
import { Medic } from '../_models/medic';
import { AuthenticationService } from '../_services/authentication.service';
import { Role, User } from '../_models/user';
import Chart from 'chart.js/auto';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public sexChart: any;
  public ageChart: any;
  patients: Patient[] = [];
  medics: Medic[] = [];
  currentMedic: Medic = {};
  currentUser: User = {};
  cardsData = {
    totalPatients: '',
    femalePatients: '',
    malePatients: '',
    averageAge: '',
  };

  constructor(
    private patientService: PatientService,
    private medicService: MedicService,
    private authService: AuthenticationService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.userValue || {};

    this.patientService.getAllPatients().subscribe((patients: Patient[]) => {
      this.medicService.getAllMedics().subscribe((medics: Medic[]) => {
        this.currentMedic =
          medics.find((m) => m.useR_ID === this.currentUser.id) || {};

        if (this.currentUser?.role == Role.Admin) {
          this.patients = patients;
          this.medics = medics;
        } else {
          this.patients = patients.filter(
            (p) => p.assignatioN_CODE === this.currentMedic.assignatioN_CODE
          );
        }

        this.cardsData.totalPatients = patients.length.toString();
        this.cardsData.femalePatients =
          this.computePercentage(
            this.patients.length,
            this.patients.filter((p) => p.sex === 'f').length
          )
            .toFixed(2)
            .toString() + '%';

        this.cardsData.malePatients =
          this.computePercentage(
            this.patients.length,
            this.patients.filter((p) => p.sex === 'm').length
          )
            .toFixed(2)
            .toString() + '%';

        this.cardsData.averageAge = (
          this.patients.reduce(
            (accum: number, reducer: any) => accum + reducer.age,
            0
          ) / this.patients.length
        )
          .toFixed(2)
          .toString();

        this.createSexChart(this.patients);
        this.createAgeChart(this.patients);
      });
    });
  }

  createAgeChart(patients: Patient[]) {
    const patientsByAge: any = {
      '0 - 16': {},
      '17 - 30': {},
      '31 - 45': {},
      '46 - 99': {},
    };

    Object.keys(patientsByAge).forEach(key => {
      const ref = patientsByAge[key];
      ref.min = parseInt(key.split('-')[0].trim());
      ref.max = parseInt(key.split('-')[1].trim());
      ref.females = [];
      ref.males = [];
      ref.age = [];
    })

    console.log(patients);

    patients.forEach((patient: Patient) => {
      Object.keys(patientsByAge).forEach(key => {
        const ref = patientsByAge[key];
        const age = patient.age || 0;
        if(age >= ref.min && age <= ref.max) {
          if (patient.sex === Sex.Male) {
            ref.males.push(patient.id);
          }
    
          if (patient.sex === Sex.Female) {
            ref.females.push(patient.id);
          }

          ref.age.push(patient.id);
        }
      });
    });

    console.log(patientsByAge);


    this.ageChart = new Chart('ageChart', {
      type: 'bar', //this denotes tha type of chart

      data: {
        // values on X-Axis
        labels: [...Object.keys(patientsByAge)],
        datasets: [
          {
            label: 'Age',
            data: [
              ...Object.keys(patientsByAge).map(
                (key) => patientsByAge[key].age.length
              ),
            ],
            backgroundColor: '#f44336',
          },
          {
            label: 'Males',
            data: [
              ...Object.keys(patientsByAge).map(
                (key) => patientsByAge[key].males.length
              ),
            ],
            backgroundColor: '#4CAF50',
          },
          {
            label: 'Female',
            data: [
              ...Object.keys(patientsByAge).map(
                (key) => patientsByAge[key].females.length
              ),
            ],
            backgroundColor: '#FF9800',
          },
        ],
      },
      options: {
        aspectRatio: 2,
      },
    });
  }

  createSexChart(patients: Patient[]) {
    const patientsByDate: any = {};

    patients.forEach((patient: Patient) => {
      const date = new Date(<string>patient.createD_AT);
      const label = date.toISOString().split('T')[0];

      if (!patientsByDate[label]) {
        patientsByDate[label] = {
          male: [],
          female: [],
        };
      }

      if (patient.sex === Sex.Male) {
        patientsByDate[label].male.push(patient.id);
      }

      if (patient.sex === Sex.Female) {
        patientsByDate[label].female.push(patient.id);
      }
    });

    const sortedDates = Object.keys(patientsByDate).sort((a, b) => {
      const dateB = new Date(b).getTime();
      const dateA = new Date(a).getTime();

      return dateA - dateB;
    });

    this.sexChart = new Chart('sexChart', {
      type: 'bar', //this denotes tha type of chart

      data: {
        // values on X-Axis
        labels: [
          ...sortedDates.map((d) => this.datePipe.transform(d, 'dd.MM.yyyy')),
        ],
        datasets: [
          {
            label: 'Males',
            data: [
              ...Object.keys(patientsByDate).map(
                (key) => patientsByDate[key].male.length
              ),
            ],
            backgroundColor: '#4CAF50',
          },
          {
            label: 'Female',
            data: [
              ...Object.keys(patientsByDate).map(
                (key) => patientsByDate[key].female.length
              ),
            ],
            backgroundColor: '#FF9800',
          },
        ],
      },
      options: {
        aspectRatio: 2,
      },
    });
  }

  computePercentage(total: number, rest: number) {
    return (rest / total) * 100;
  }
}
