import { environment } from 'src/environments/environment';
import { Disease } from '../_models/settings';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DiseasesService {
  constructor(private http: HttpClient) {}

  getAllDiseases(): Observable<Disease[]> {
    return this.http.get<any>(`${environment.apiUrl}/Diseases/GetAllDiseases`).pipe(
      map(response => Object.values(response.data))
    );
  }

  addDisease(Disease: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/Diseases/AddDisease`, Disease);
  }

  deleteDisease(diseaseID: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/Diseases/DeleteDisease/${diseaseID}`);
  }
}
