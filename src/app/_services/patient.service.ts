import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Patient } from '../_models/patient';

@Injectable({ providedIn: 'root' })
export class PatientService {
  constructor(private http: HttpClient) {}

  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(
      `${environment.apiUrl}/Pacient/GetAllPacient`
    );
  }

  getPatientByUserId(user: User): Observable<Patient> {
    return this.http.get<Patient>(
      `${environment.apiUrl}/Pacient/GetPacientbyUid/${user.id}`
    );
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
    const headers = new HttpHeaders().set(
      'Content-Type',
      'text/plain; charset=utf-8'
    );

    return this.http.delete(
      `${environment.apiUrl}/Pacient/DeleteUser/${patient.id}`,
      { headers, responseType: 'text' as const }
    );
  }
}
