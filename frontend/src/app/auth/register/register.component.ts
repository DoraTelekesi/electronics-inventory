import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { RegisterUser } from '../../interfaces/user';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ThreeService } from '../../services/three/three.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements AfterViewInit, OnDestroy {
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private threeService: ThreeService,
  ) {}

  registerForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  @ViewChild('canvasBox') canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    if (this.canvasRef) {
      this.threeService.init(this.canvasRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.threeService.dispose();
  }

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
      },
    });
  }
}
