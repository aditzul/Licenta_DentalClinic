import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of, switchMap } from 'rxjs';
import { Patient, PatientComment, PatientHistory, Tooth } from '../_models/patient';

@Injectable({ providedIn: 'root' })
export class PatientService {
  constructor(private http: HttpClient) {}

  getAllPatients(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/Patients/GetAllPatients`).pipe(
      map(response => Object.values(response.data))
    );
  }

  getPatientsByMedicID(ID: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/Patients/GetAllPatientsByMedicID/${ID}`).pipe(
      map(response => Object.values(response.data))
    );
  }
  
  getPatientById(ID: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/Patients/GetPatient/${ID}`).pipe(
      map(response => response.data[0])
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
    return this.http.put<any>(`${environment.apiUrl}/Patients/UpdatePatient/${patient.id}`, patient);
  }

  deletePatient(patient: Patient): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

    return this.http.delete(`${environment.apiUrl}/Patients/DeletePatient/${patient.id}`, { headers, responseType: 'text' as const });
  }

  GetAllCommentsByPatientID(patient: Patient): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/Comments/GetAllCommentsByPatientID/${patient.id}`).pipe(
      map(response => Object.values(response.data[0]))
    );
  }

  AddComment(comment: PatientComment): Observable<any> {
    const commentDTO: PatientComment = Object.assign(comment, {
      created_at: new Date().toISOString(),
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

  uploadDocument(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/UploadDocument`, data);
  }

  deleteDocument(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/DeleteDocument`, data);
  }

  getFilesList(ID: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/GetFilesList/${ID}`).pipe(
      map(response => response)
    );
  }

  getTeethHistory(ID: number, tooth_id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/TeethHistory/GetTeethHistory/${ID}/${tooth_id}`).pipe(
      map(response => response.data)
    );
  }

  getTeethHistoryByPatientID(ID: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/TeethHistory/GetTeethHistoryByPatientID/${ID}`).pipe(
      map(response => response.data)
    );
  }

  addTeethHistory(body: Tooth): Observable<any> {
    return this.http.post<PatientComment[]>(`${environment.apiUrl}/TeethHistory/AddTeethHistory`, body);
  }

  editTeethHistory(body: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/TeethHistory/UpdateTeethHistory/${body.id}`, body);
  }

  deleteTeethHistory(ID: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/TeethHistory/DeleteTeethHistory/${ID}`);
  }

  sendSMS(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/SMSO/SendSMS`, data);
  }
}