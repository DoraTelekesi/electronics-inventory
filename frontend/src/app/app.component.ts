import { Component } from '@angular/core';
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
export class AppComponent {
  title = 'frontend';

  constructor(private authService: AuthService) {}
}
