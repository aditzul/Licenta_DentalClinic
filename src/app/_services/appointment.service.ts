import { Appointment } from './../_models/appointment';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  constructor(private http: HttpClient) {}

  addAppointment(appointment: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/Appointments/AddAppointment`, appointment);
  }

  deleteAppointment(appointmentId: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/Appointments/DeleteAppointment/${appointmentId}`);
  }

  updateAppointment(appointmentId: number, updatedData: any): Observable<any> {
    const url = `${environment.apiUrl}/Appointments/UpdateAppointment/${appointmentId}`;
    return this.http.put<any>(url, updatedData);
  }

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<any>(`${environment.apiUrl}/Appointments/GetAllAppointments`).pipe(
      map(response => response.data[0])
    );
  }


  getLastAppointmentID(): Observable<number> {
    return this.http.get<any>(`${environment.apiUrl}/Appointments/GetLastID`).pipe(
      map(response => response.data as number)
    );
  }

  getAllAppointmentsByPatientID(patientID: number): Observable<any[]> {
    const url = `${environment.apiUrl}/Appointments/GetAllAppointmentsByPatientID/${patientID}`;
    return this.http.get<any[]>(url);
  }

  getAllAppointmentsByMedicID(medicID: number): Observable<any[]> {
    const url = `${environment.apiUrl}/Appointments/GetAllAppointmentsByMedicID/${medicID}`;
    return this.http.get<any[]>(url);
  }

}
