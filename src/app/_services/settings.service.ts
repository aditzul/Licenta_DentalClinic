import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { SMSOSettings, SMSSettings, CompanySettings } from '../_models/settings';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  constructor(private http: HttpClient) {}

  getSMSOSettings(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/Settings/GetSMSOSettings`).pipe(
      map(response => response.data[0])
    );
  }

  getSMSSettings(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/Settings/GetSMSSettings`).pipe(
      map(response => response.data[0])
    );
  }
  
  getCompanySettings(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/Settings/GetCompanySettings`).pipe(
      map(response => response.data[0])
    );
  }

  updateSMSOSettings(setting: SMSOSettings): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/Settings/UpdateSettings`, setting);
  }
  
  updateSMSSettings(setting: SMSSettings): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/Settings/UpdateSettings`, setting);
  }

  updateCompanySettings(setting: CompanySettings): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/Settings/UpdateSettings`, setting);
  }
}
