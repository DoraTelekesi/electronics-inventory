import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../interfaces/user';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SparePart } from '../../interfaces/spare-part';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.scss',
})
export class AddItemComponent {
  user$: Observable<User | null>;
  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private apiService:ApiService
  ) {
    this.user$ = this.authService.user$;
  }

  newItemForm = this.formBuilder.group({
    manufacturer: ['', [Validators.required]],
    model: ['', [Validators.required]],
    type: ['', [Validators.required]],
    depot: ['', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(1)]],
    remarks: [''],
  });

  onSubmit() {
    if (this.newItemForm.invalid) return;

    console.log(this.newItemForm.value);
    this.apiService.createSparePart(this.newItemForm.value as SparePart).subscribe({
      next:(item) => {
        console.log('New item', item);
        this.router.navigate(['spare-part-list'])
      },
      error: (err) => {
        console.error('Item not added', err)
      }
    })
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
