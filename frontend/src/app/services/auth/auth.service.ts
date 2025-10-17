import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, BehaviorSubject } from 'rxjs';
import { LoginUser, RegisterUser, User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/login';

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable(); 
  constructor(private http: HttpClient) {}

  login(credentials: LoginUser): Observable<User> {
    return this.http
      .post<{ user: User }>(this.apiUrl, credentials, {
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

  getCurrentUser(): Observable<User> {
    return this.http
      .get<User>('http://localhost:3000/me', { withCredentials: true })
      .pipe(tap((user) => this.userSubject.next(user)));
  }

  isLoggedIn(): boolean {
    return this.userSubject.value !== null;
  }
}
