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
  loaded = false;
  lastPatients: Patient[] = [];

  constructor(
    private patientService: PatientService,
    private medicService: MedicService,
    private authService: AuthenticationService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.userValue || {};

    this.loadPatients();

    this.medicService.getAllMedics().subscribe((medics: Medic[]) => {
      this.medics = medics;
    });
  }

  loadPatients() {
    const userRole = this.authService.userValue?.role;

    if (userRole === Role.Admin) {
      // User is an Admin, load all patients
      this.patientService.getAllPatients().subscribe((patients: Patient[]) => {
        this.patients = patients;
        this.processData();
      });
    } else if (userRole === Role.Medic) {
      // User is a Medic, load patients by Medic ID
      const medicId = this.authService.userValue?.id;
      if (medicId) {
        this.patientService.getPatientsByMedicID(medicId.toString()).subscribe((response: any) => {
          this.patients = response;
          this.processData();
        });
      } else {
        console.error('Medic ID not found in user details.');
      }
    }
  }

  processData() {
    this.loaded = true;
    //this.currentMedic = this.medics.find((m) => m.useR_ID === this.currentUser.id) || {};
    //console.log(this.currentMedic) - NU MERGE
    this.createCardsData();
    this.lastPatients = this.computeLastPatients(this.patients);

    setTimeout(() => {
      this.createSexChart(this.patients);
      this.createAgeChart(this.patients);
    }, 0);
  }

  computeLastPatients(patients: Patient[]): Patient[] {
    const sortedByDate = patients.sort((a, b) => this.sortByDate(<string>a.created_at, <string>b.created_at));
    return sortedByDate.slice(-5).reverse();
  }

  createCardsData() {
    const malePatients = this.patients.filter((p) => p.sex === Sex.Male).length;
    const femalePatients = this.patients.filter((p) => p.sex === Sex.Female).length;

    this.cardsData.totalPatients = this.patients.length.toString();
    this.cardsData.femalePatients = this.computePercentage(this.patients.length, femalePatients).toFixed(2).toString() + '%';
    this.cardsData.malePatients = this.computePercentage(this.patients.length, malePatients).toFixed(2).toString() + '%';
    this.cardsData.averageAge = (this.patients.reduce((accum: number, reducer: any) => accum + reducer.age, 0) / this.patients.length).toFixed(2).toString();

  }

  createAgeChart(patients: Patient[]) {
    const patientsByAge: any = {
      '0 - 16': {},
      '17 - 30': {},
      '31 - 45': {},
      '46 - 99': {},
    };

    Object.keys(patientsByAge).forEach((key) => {
      const ref = patientsByAge[key];
      ref.min = parseInt(key.split('-')[0].trim());
      ref.max = parseInt(key.split('-')[1].trim());
      ref.females = [];
      ref.males = [];
      ref.age = [];
    });

    patients.forEach((patient: Patient) => {
      Object.keys(patientsByAge).forEach((key) => {
        const ref = patientsByAge[key];
        const age = patient.age || 0;
        if (age >= ref.min && age <= ref.max) {
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

    this.ageChart = new Chart('ageChart', {
      type: 'bar', //this denotes tha type of chart

      data: {
        // values on X-Axis
        labels: [...Object.keys(patientsByAge)],
        datasets: [
          {
            label: 'Total',
            data: [...Object.keys(patientsByAge).map((key) => patientsByAge[key].age.length)],
            backgroundColor: '#f44336',
            stack: 'stack1',
          },
          {
            label: 'Males',
            data: [...Object.keys(patientsByAge).map((key) => patientsByAge[key].males.length)],
            backgroundColor: '#4CAF50',
            stack: 'stack2',
          },
          {
            label: 'Female',
            data: [...Object.keys(patientsByAge).map((key) => patientsByAge[key].females.length)],
            backgroundColor: '#FF9800',
            stack: 'stack2',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }

  createSexChart(patients: Patient[]) {
    const patientsByDate: any = {};

    patients.forEach((patient: Patient) => {
      const date = new Date(<string>patient.created_at);
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

    const sortedDates = Object.keys(patientsByDate).sort(this.sortByDate);

    this.sexChart = new Chart('sexChart', {
      type: 'bar', //this denotes tha type of chart

      data: {
        // values on X-Axis
        labels: [...sortedDates.map((d) => this.datePipe.transform(d, 'dd.MM.yyyy'))],
        datasets: [
          {
            label: 'Total',
            data: [...Object.keys(patientsByDate).map((key) => patientsByDate[key].male.length + patientsByDate[key].female.length)],
            backgroundColor: '#03a9f4',
            stack: 'stack1',
          },
          {
            label: 'Males',
            data: [...Object.keys(patientsByDate).map((key) => patientsByDate[key].male.length)],
            backgroundColor: '#4CAF50',
            stack: 'stack2',
          },
          {
            label: 'Female',
            data: [...Object.keys(patientsByDate).map((key) => patientsByDate[key].female.length)],
            backgroundColor: '#FF9800',
            stack: 'stack2',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }

  computePercentage(total: number, rest: number) {
    return (rest / total) * 100;
  }

  sortByDate(a: string, b: string): number {
    const dateB = new Date(b).getTime();
    const dateA = new Date(a).getTime();

    return dateA - dateB;
  }
}
