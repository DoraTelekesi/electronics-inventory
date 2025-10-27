import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../interfaces/user';
import { SparePart } from '../../interfaces/spare-part';
import { ApiService } from '../../services/api.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { shareReplay, Observable } from 'rxjs';

@Component({
  selector: 'app-spare-part-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './spare-part-list.component.html',
  styleUrl: './spare-part-list.component.scss',
})
export class SparePartListComponent {
  user$: Observable<User | null>;
  sparePartList$ = this.api.getSparePartList().pipe(shareReplay(1));
  constructor(
    private authService: AuthService,
    private router: Router,
    public api: ApiService
  ) {
    this.user$ = authService.user$;
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failec', err);
      },
    });
  }
}
