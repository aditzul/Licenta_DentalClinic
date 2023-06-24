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
        if (request.method == 'POST' || request.method == 'PUT') {
          if (e instanceof HttpResponse && (e.status === 200 || e.status === 204)) {
            if (!request.url.includes('/Login')) {
              this.snackBar.open('Saved successfully.', 'close', {
                duration: 2000,
                panelClass: 'successSnack',
              });
            }
          }
        }
        if (request.method === 'DELETE') {
          if (e instanceof HttpResponse && (e.status === 200 || e.status === 204)) {
            this.snackBar.open('Deleted successfully.', 'close', {
              duration: 2000,
              panelClass: 'successSnack',
            });
          }
        }
      }),
      catchError((error) => {
        const message = error?.error?.detail || error.error.title || error.message;
        this.snackBar.open(message, 'close', {
          panelClass: 'errorSnack',
        });
        return throwError(error);
      })
    );
  }
}
