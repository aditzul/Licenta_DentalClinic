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
    return this.http.get<any>(`${environment.apiUrl}/Patients/GetAllPatients`).pipe(
      map(response => response.data)
    );
  }

  getPatientsByMedicID(ID: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/Patients/GetAllPatientsByMedicID/${ID}`).pipe(
      map(response => response.data)
    );
  }
  
  getPatientById(ID: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/Patients/GetPatient/${ID}`).pipe(
      map(response => response.data)
    );
  }

  addPatient(patient: Patient): Observable<any> {
    const patientDTO: Patient = Object.assign(patient, {
      createD_AT: new Date().toISOString(),
    });
    return this.http.post<any>(`${environment.apiUrl}/Patients/AddPatient`, {
      ...patientDTO,
    });
  }
  
  updatePatient(patient: Patient): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/Patients/UpdatePatient/${patient.ID}`, {
      ...patient,
    });
  }

  deletePatient(patient: Patient): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

    return this.http.delete(`${environment.apiUrl}/Patients/DeletePatient/${patient.ID}`, { headers, responseType: 'text' as const });
  }

  GetAllCommentsByPatientID(patient: Patient): Observable<PatientComment[]> {
    return this.http.get<PatientComment[]>(`${environment.apiUrl}/Comments/GetAllCommentsByPatientID/${patient.ID}`);
  }

  AddComment(comment: PatientComment): Observable<any> {
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

  //TO CHECK HERE BELOW WHAT I KEEP AND WHAT I DELETE

  getMedicalDataByPatientId(patient: Patient): Observable<PatientHistory[]> {
    return this.http.get<PatientHistory[]>(`${environment.apiUrl}/MedicalHistory/GetAllMedicalHistory/${patient.ID}`);
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
