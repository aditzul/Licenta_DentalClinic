import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class SnackbarInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((e) => {
        if (e instanceof HttpResponse) {
          if (e.status === 200) {
            let responseBody = e.body;
            // Verificați dacă responseBody este un șir de caractere și încercați să-l parsăm într-un obiect JSON
            if (typeof responseBody === 'string') {
              try {
                responseBody = JSON.parse(responseBody);
              } catch (error) {
                console.error('Error parsing response body:', error);
              }
            }      
            if (responseBody && responseBody.status === 200 && responseBody.message) {
              const message = responseBody.message;
              this.snackBar.open(message, 'close', {
                duration: 2000,
                panelClass: 'successSnack',
              });
            }
          }
        }
      }),
      catchError((error) => {
        const message = error?.error?.message || 'Eroare';
        const errorMessage = error?.error?.error || '';
        this.snackBar.open(message + ' ' + errorMessage, 'close', {
          panelClass: 'errorSnack',
        });
        return throwError(error);
      })
    );
  }
}
