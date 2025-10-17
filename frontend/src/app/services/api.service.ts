import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}
  getSparePartList(): Observable<any> {
    return this.http
      .get<{ message: string; spareParts: any[] }>(this.apiUrl, {
        withCredentials: true,
      })
      .pipe(map((res) => res.spareParts));
  }
}
