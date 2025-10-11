import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  // sparePartList$: Observable<any>;
  // constructor(private apiService: ApiService) {
  //   this.sparePartList$ = this.apiService.getSparePartList();
  // }
}
