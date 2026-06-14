import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

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
import { ThreeService } from '../../services/three/three.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements AfterViewInit, OnDestroy{

@ViewChild("canvasBox") canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor(
    private animation: ThreeService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  ngAfterViewInit(): void {
    if (this.canvasRef) {
      this.animation.init(this.canvasRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.animation.dispose();
  }


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
