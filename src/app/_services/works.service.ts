import { environment } from 'src/environments/environment';
import { Work } from '../_models/settings';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WorksService {
  constructor(private http: HttpClient) {}

  getAllWorks(): Observable<Work[]> {
    return this.http.get<any>(`${environment.apiUrl}/Works/GetAllWorks`).pipe(
      map(response => Object.values(response.data))
    );
  }

  addWork(Work: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/Works/AddWork`, Work);
  }

  deleteWork(workID: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/Works/DeleteWork/${workID}`);
  }
}
