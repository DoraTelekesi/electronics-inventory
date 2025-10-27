import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../interfaces/user';
import { SparePart} from '../../interfaces/spare-part';
import { ApiService } from '../../services/api.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { shareReplay, Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-spare-part-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './spare-part-list.component.html',
  styleUrl: './spare-part-list.component.scss',
})
export class SparePartListComponent implements OnInit {
  user$: Observable<User | null>;
  sparePartList$ = new BehaviorSubject<SparePart[]>([]);
  // sparePartList$ = this.api.getSparePartList().pipe(shareReplay(1));
  constructor(
    private authService: AuthService,
    private router: Router,
    public api: ApiService
  ) {
    this.user$ = authService.user$;
  }

  ngOnInit(): void {
    this.loadSpareParts();
  }

  loadSpareParts() {
    this.api
      .getSparePartList()
      .subscribe((list) => this.sparePartList$.next(list));
  }

  onDelete(id: string) {
    console.log(id);
    this.api.deleteSparePart(id).subscribe({
      next: (item) => {
        console.log('Successfully deleted', item);
        const updatedList = this.sparePartList$.value.filter(
          (item) => item._id != id
        );
        this.sparePartList$.next(updatedList);
      },
      error: (err) => {
        console.error('Problem deleting', err);
      },
    });
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed', err);
      },
    });
  }
}
