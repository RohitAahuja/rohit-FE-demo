import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { User } from '../models';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticateService {
    authUrl = environment.baseUrl + 'auth/';
    public currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    register(user: User) {
        return this.http.post(`${this.authUrl}signup`, user);
    }

    login(email: string, password: string) {
        return this.http.post<any>(`${this.authUrl}login`, { email, password })
            .pipe(tap(user => {
                // login successful if there's a jwt token in the response
                if (user && user.jwtToken) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
            }));
    }

    logout() {
        // remove user from local storage to log user out
        sessionStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}