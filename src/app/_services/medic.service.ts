import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Medic } from '../_models/medic';

@Injectable({ providedIn: 'root' })
export class MedicService {
  constructor(private http: HttpClient) {}

  getAllMedics(): Observable<Medic[]> {
    return this.http.get<any>(`${environment.apiUrl}/Medic/GetAllMedics`);
  }

  getMedic(medic: Medic): Observable<Medic> {
    return this.http.get<any>(`${environment.apiUrl}/Medic/GetMedic/${medic.id}`);
  }

  addMedic(medic: Medic): Observable<Medic> {
    const medicDTO: Medic = Object.assign(medic, {
      createD_AT: new Date().toISOString(),
    });
    return this.http.post<any>(`${environment.apiUrl}/Medic/AddMedic`, {
      ...medicDTO,
    });
  }

  updateMedic(medic: Medic): Observable<Medic> {
    return this.http.put<any>(`${environment.apiUrl}/Medic/UpdateMedic`, {
      ...medic,
    });
  }

  deleteMedic(medic: Medic): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

    return this.http.delete(`${environment.apiUrl}/Medic/DeleteMedic/${medic.id}`, { headers, responseType: 'text' as const });
  }

  getMedicByAssignCode(assignCode: string): Observable<Medic> {
    return this.getAllMedics().pipe(
      switchMap((medics: Medic[]) => {
        return of(medics.find((m) => m.id?.toString() === assignCode) || {});
      })
    );
  }
  

}
