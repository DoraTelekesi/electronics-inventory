import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { User } from '../../../interfaces/user';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ThreeService } from '../../../services/three/three.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  user$: Observable<User | null>;
  @ViewChild('canvasBox') canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private threeService: ThreeService,
  ) {
    this.user$ = authService.user$;
  }

  ngAfterViewInit(): void {
    if (this.canvasRef) {
      this.threeService.init(this.canvasRef.nativeElement);
    }
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
  ngOnDestroy(): void {
    // Any cleanup logic can go here.
  }
}
