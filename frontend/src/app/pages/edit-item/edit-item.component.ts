import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SparePart, CreateSparePart } from '../../interfaces/spare-part';
import { ApiService } from '../../services/api.service';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { User } from '../../interfaces/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-item',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-item.component.html',
  styleUrl: './edit-item.component.scss',
})
export class EditItemComponent {
  user$: Observable<User | null>;
  sparePart$ = new BehaviorSubject<SparePart | null>(null);
  sparePartId!: string | null;
  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private activeRoute: ActivatedRoute
  ) {
    this.user$ = this.authService.user$;
    this.sparePartId = this.activeRoute.snapshot.paramMap.get('id');
    if (this.sparePartId) {
      console.log(this.getEntriesForSparePart(this.sparePartId));
    }
  }

  editItemForm = this.formBuilder.group({
    manufacturer: ['', [Validators.required]],
    model: ['', [Validators.required]],
    type: ['', [Validators.required]],
    depot: ['', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(1)]],
    remarks: [''],
  });

  getEntriesForSparePart(id: string) {
    this.apiService.showSparePart(id).subscribe({
      next: (item) => {
        console.log('Selected Item:', item);
        this.sparePart$.next(item);
        //we can choose from setValue or patchValue
        // patchValue - paritally updates the form, does not need to receive values for all fields
        this.editItemForm.patchValue(item);
      },
      error: (err) => {
        console.error('cannot get item', err);
      },
    });
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

  onSubmit() {
    if (this.editItemForm.invalid) return;
    if (this.sparePartId && this.editItemForm.value) {
      this.apiService
        .editSparePart(this.sparePartId, this.editItemForm.value as SparePart)
        .subscribe({
          next: (item) => {
            console.log(item);
            this.router.navigate(['spare-part-list']);
          },
          error: (err) => {
            console.error('Problem', err);
          },
        });
    }
  }
}
