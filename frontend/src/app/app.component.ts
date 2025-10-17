import { Component, OnInit } from '@angular/core';
import { MainComponent } from './main/main.component';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(private authService: AuthService){}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => console.log('Restored user:', user),
      error: () => console.log('No user logged in'),
    });
  }
}
