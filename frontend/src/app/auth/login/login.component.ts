import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private formBuilder: FormBuilder) {}
  loginForm = this.formBuilder.group({
    email:['', [Validators.required, Validators.email]],
    password:['', Validators.required]
  });

  onSubmit() {}
}
