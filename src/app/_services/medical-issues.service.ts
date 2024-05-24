import { environment } from 'src/environments/environment';
import { MedicalIssue } from '../_models/settings';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MedicalIssuesService {
  constructor(private http: HttpClient) {}

  getAllIssues(): Observable<MedicalIssue[]> {
    return this.http.get<any>(`${environment.apiUrl}/MedicalIssues/GetAllIssues`).pipe(
      map(response => Object.values(response.data))
    );
  }

  addIssue(MedicalIssue: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/MedicalIssues/AddIssue`, MedicalIssue);
  }

  deleteIssue(workID: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/MedicalIssues/DeleteIssue/${workID}`);
  }
}
