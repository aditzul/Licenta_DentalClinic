import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of, switchMap } from 'rxjs';
import { AssignedPatientsData, Patient, PatientComment, PatientHistory, SensorData, SensorSessionData } from '../_models/patient';

@Injectable({ providedIn: 'root' })
export class PatientService {
  constructor(private http: HttpClient) {}

  getAllPatients(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/Pacient/GetAllPacients`);
  }

  getPatientsByMedicID(medicID: string): Observable<AssignedPatientsData> {
    return this.http.get<AssignedPatientsData>(`${environment.apiUrl}/Pacient/GetPacientsByMedicID/${medicID}`);
  }
  
  getPatientById(userId: string): Observable<Patient> {
    return this.http.get<Patient>(`${environment.apiUrl}/Pacient/getPacientById/${userId}`);
  }

  addPatient(patient: Patient): Observable<any> {
    const patientDTO: Patient = Object.assign(patient, {
      createD_AT: new Date().toISOString(),
    });
    return this.http.post<any>(`${environment.apiUrl}/Pacient/AddPacient`, {
      ...patientDTO,
    });
  }
  

  updatePatient(patient: Patient): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/Pacient/UpdatePacient`, {
      ...patient,
    });
  }

  deletePatient(patient: Patient): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

    return this.http.delete(`${environment.apiUrl}/Pacient/DeletePacient/${patient.patienT_ID}`, { headers, responseType: 'text' as const });
  }

  getLastId(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/Pacient/GetLastID`);
  }

  getSensorDataByPatientId(patient: Patient): Observable<SensorSessionData[]> {
    return this.http.get<SensorData[]>(`${environment.apiUrl}/Sensor/GetAllSensorData/${patient.patienT_ID}`).pipe(
      switchMap((sensorData: SensorData[]): Observable<SensorSessionData[]> => {
        const sessionDict: any = {};
        sensorData.forEach((read) => {
          const entryIdKey = 'key-' + read.entrY_ID;
          if (!sessionDict[entryIdKey]) {
            sessionDict[entryIdKey] = [];
          }

          sessionDict[entryIdKey].push(read);
        });

        const sensorSessionData: SensorSessionData[] = Object.keys(sessionDict).map((key) => {
          const session = sessionDict[key];
          const temperatureAvg = computeAverage(session, 'temperature');
          const heartAvg = computeAverage(session, 'pulse');
          const EKGAvg = computeAverage(session, 'ekg');
          const createD_AT = session[0].createD_AT;
          const entrY_ID = session[0].entrY_ID;

          return {
            session,
            temperatureAvg,
            heartAvg,
            EKGAvg,
            createD_AT,
            entrY_ID,
          };
        });

        return of(sensorSessionData);
      })
    );

    function computeAverage(session: any[], field: string) {
      const sum = session.reduce((accum, reducer) => accum + reducer[field], 0);
      return parseFloat((sum / session.length).toFixed(2));
    }
  }
  getCommentDataByPatientId(patient: Patient): Observable<PatientComment[]> {
    return this.http.get<PatientComment[]>(`${environment.apiUrl}/Comments/GetAllComments/${patient.patienT_ID}`);
  }

  addCommentDataByPatientId(comment: PatientComment): Observable<any> {
    const commentDTO: PatientComment = Object.assign(comment, {
      createD_AT: new Date().toISOString(),
    });

    return this.http.post<PatientComment[]>(`${environment.apiUrl}/Comments/AddComment`, {
      ...commentDTO,
    });
  }

  deleteComment(commentId: number): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

    return this.http.delete(`${environment.apiUrl}/Comments/DeleteComment/${commentId}`, {
      headers,
      responseType: 'text' as const,
    });
  }

  getMedicalDataByPatientId(patient: Patient): Observable<PatientHistory[]> {
    return this.http.get<PatientHistory[]>(`${environment.apiUrl}/MedicalHistory/GetAllMedicalHistory/${patient.patienT_ID}`);
  }

  AddMedicalDataByPatientId(history: PatientHistory): Observable<any> {
    const historyDTO: PatientHistory = Object.assign(history, {
      createD_AT: new Date().toISOString(),
    });

    return this.http.post<PatientComment[]>(`${environment.apiUrl}/MedicalHistory/AddMedicalHistory`, {
      ...historyDTO,
    });
  }
}
