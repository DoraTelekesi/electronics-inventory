import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  tap,
  map,
  BehaviorSubject,
  catchError,
  of,
  shareReplay,
} from 'rxjs';
import { LoginUser, RegisterUser, User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private userLoaded = false;
  private currentUserRequest$: Observable<User | null> | null = null;
  constructor(private http: HttpClient) {}

  login(credentials: LoginUser): Observable<User> {
    return this.http
      .post<{ user: User }>(`${this.apiUrl}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          console.log('Raw login response:', res);
          this.userSubject.next(res.user);
          this.userLoaded = true;
          this.currentUserRequest$ = null;
        }),
        map((res) => res.user)
      );
  }

  register(credentials: RegisterUser): Observable<User> {
    return this.http
      .post<{ user: User }>(`${this.apiUrl}/register`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          console.log('Registration response:', res);
        }),
        map((res) => res.user)
      );
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.userSubject.next(null);
          this.userLoaded = false;
          this.currentUserRequest$ = null;
          console.log('User logged out');
        })
      );
  }

  getCurrentUser(): Observable<User | null> {
    if (this.userLoaded) {
      return of(this.userSubject.value);
    }
    if (this.currentUserRequest$) {
      return this.currentUserRequest$;
    }
    this.currentUserRequest$ = this.http
      .get<User>(`${this.apiUrl}/me`, { withCredentials: true })
      .pipe(
        tap((user) => {
          this.userSubject.next(user);
          this.userLoaded = true;
        }),
        catchError((err) => {
          if (err.status === 401) this.userSubject.next(null);
          this.userLoaded = true;
          return of(null);
        }),
        shareReplay(1),
        tap(() => {
          this.currentUserRequest$ = null;
        })
      );
    return this.currentUserRequest$;
  }

  isAuthenticated(): boolean {
    return this.userLoaded && this.userSubject.value !== null;
  }

  isAuthenticationChecked(): boolean {
    return this.userLoaded;
  }

  // isLoggedIn(): boolean {
  //   console.log(this.userSubject.value);
  //   return this.userSubject.value !== null;
  // }
}
