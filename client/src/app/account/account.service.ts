import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from '../shared/models/user';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root'
})
export class AccountService {

    baseUrl = environment.apiUrl;
    private currentUserSource = new ReplaySubject<IUser>(1);
    currentUser$ = this.currentUserSource.asObservable();

    constructor(private http: HttpClient, private router: Router) { }





    loadCurrentUser(token: string): Observable<any> {
        if (token === null) {
            this.currentUserSource.next(null);
            return of(null);
        }
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', `Bearer ${token}`);

        return this.http.get(`${this.baseUrl}account`, { headers }).pipe(
            map((user: IUser) => {
                if (user) {
                    localStorage.setItem('token', user.token);
                    this.currentUserSource.next(user);
                }
            })
        );
    }

    login(values: any): Observable<any> {
        return this.http.post(`${this.baseUrl}account/login`, values).pipe(
            map((user: IUser) => {
                if (user) {
                    localStorage.setItem('token', user.token);
                    this.currentUserSource.next(user);
                    console.log(this.currentUserSource);
                    console.log(this.currentUser$);
                }
            })
        );
    }

    register(values: any): Observable<any> {
        return this.http.post(`${this.baseUrl}account/register`, values).pipe(
            map((user: IUser) => {
                if (user) {
                    localStorage.setItem('token', user.token);
                    this.currentUserSource.next(user);
                    console.log(this.currentUserSource);
                    console.log(this.currentUser$);
                }
            })
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        this.currentUserSource.next(null);
        this.router.navigateByUrl('/');
    }


    checkEmailExist(email: string): Observable<object> {
        return this.http.get(`${this.baseUrl}account/emailexists?email=${email}`);
    }
}
