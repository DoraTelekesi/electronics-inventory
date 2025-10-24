import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { LoginUser } from '../../interfaces/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    const credentials: LoginUser = this.loginForm.value as LoginUser;

    this.authService.login(credentials).subscribe({
      next: (user) => {
        console.log('Logged in user:', user);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login failed:', err);
      },
    });
  }
}
