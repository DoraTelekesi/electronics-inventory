import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs';
import { CreateSparePart, SparePart } from '../interfaces/spare-part';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/spare-part-list';

  constructor(private http: HttpClient) {}
  getSparePartList(): Observable<SparePart[]> {
    return this.http
      .get<{ message: string; spareParts: SparePart[] }>(this.apiUrl, {
        withCredentials: true,
      })
      .pipe(map((res) => res.spareParts));
  }

  createSparePart(entries: CreateSparePart): Observable<CreateSparePart[]> {
    return this.http
      .post<{ message: String; sparePart: CreateSparePart[] }>(this.apiUrl, entries, {
        withCredentials: true,
      })
      .pipe(map((res) => res.sparePart));
  }

  deleteSparePart(id: string): Observable<SparePart[]> {
    return this.http
      .delete<{ message: String; sparePart: SparePart[] }>(
        `${this.apiUrl}/${id}`,
        { withCredentials: true }
      )
      .pipe(map((res) => res.sparePart));
  }
}
