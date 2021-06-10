import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AlertService, AuthenticateService } from '../services';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticateService, private alertService: AlertService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.jwtToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.jwtToken}`
                }
            });
        }


        return next.handle(request).pipe(
            catchError((err) => {
                if (err && err.status === 401) {
                    // meaning unauthenticated user
                    sessionStorage.removeItem('currentUser');
                    this.authenticationService.currentUserSubject.next(null);
                    this.alertService.error("Your token got expired, Please try login again!!!");
                    this.router.navigate(['/login']);
                } else {
                    this.alertService.error(err.error.message);
                }
                throw err;
            }))
    }
}