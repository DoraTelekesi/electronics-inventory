import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { RegisterUser } from '../../interfaces/user';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  registerForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.registerForm.invalid) return;

    const credentials: RegisterUser = this.registerForm.value as RegisterUser;

    this.authService.register(credentials).subscribe({
      next: (user) => {
        console.log('Registered user:', user);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
      }
    });
  }
}
