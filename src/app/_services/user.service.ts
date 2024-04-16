import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<any>(`${environment.apiUrl}/Users/GetAllUsers`).pipe(
      map(response => response.data[0])
    );
  }

  getAllMedics(): Observable<User[]> {
    return this.http.get<any>(`${environment.apiUrl}/Users/GetAllMedics`);
  }

  getUser(user: User): Observable<User> {
    return this.http.get<any>(`${environment.apiUrl}/Users/GetUser/${user.id}`);
  }

  isUserExists(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/Users/IsUserExists/${username}`);
  }

  addUser(user: User): Observable<any> {
    const userDTO: User = Object.assign(user, {
      createD_AT: new Date().toISOString(),
    });
    return this.http.post<any>(`${environment.apiUrl}/Users/AddUser`, {
      ...userDTO,
    });
  }

  updateUser(user: User): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/Users/UpdateUser`, {
      ...user,
    });
  }

  deleteUser(user: User): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

    return this.http.delete(`${environment.apiUrl}/Users/DeleteUser/${user.id}`, { headers, responseType: 'text' as const });
  }

  getLastId(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/Users/GetLastID`);
  }
}
