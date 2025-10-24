import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, BehaviorSubject } from 'rxjs';
import { LoginUser, RegisterUser, User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
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
          console.log('Raw login response:', res);
          this.userSubject.next(res.user);
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
          console.log('User logged out');
        })
      );
  }

  getCurrentUser(): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/me`, { withCredentials: true })
      .pipe(tap((user) => this.userSubject.next(user)));
  }

  isLoggedIn(): boolean {
    console.log(this.userSubject.value);
    return this.userSubject.value !== null;
  }
}
