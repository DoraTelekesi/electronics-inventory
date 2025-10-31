import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../interfaces/user';
import { SparePart, FilterSparePart } from '../../interfaces/spare-part';
import { ApiService } from '../../services/api.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { shareReplay, Observable, BehaviorSubject } from 'rxjs';
import { FilterSparePartComponent } from '../../filter-spare-part/filter-spare-part.component';

@Component({
  selector: 'app-spare-part-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FilterSparePartComponent],
  templateUrl: './spare-part-list.component.html',
  styleUrl: './spare-part-list.component.scss',
})
export class SparePartListComponent implements OnInit {
  user$: Observable<User | null>;
  sparePartList$ = new BehaviorSubject<SparePart[]>([]);
  // sparePartList$ = this.api.getSparePartList().pipe(shareReplay(1));
  filterOpened = true;
  filteredItem!: FilterSparePart;
  isFiltered = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    public api: ApiService
  ) {
    this.user$ = authService.user$;
  }

  receiveFromFilter(item: FilterSparePart) {
    this.filteredItem = item;
    console.log(this.filteredItem.manufacturer);
    this.isFiltered = true;
    this.loadSpareParts();
  }

  clearFilter() {
    this.isFiltered = false;
    this.loadSpareParts();
  }

  ngOnInit(): void {
    this.loadSpareParts();
  }

  loadSpareParts() {
    this.api.getSparePartList().subscribe((list) => {
      if (this.isFiltered) {
        let filtered = list.filter((part) => {
          return (
            (!this.filteredItem.manufacturer ||
              part.manufacturer
                .toLowerCase()
                .includes(this.filteredItem.manufacturer.toLowerCase())) &&
            (!this.filteredItem.model ||
              part.model
                .toLowerCase()
                .includes(this.filteredItem.model.toLowerCase())) &&
            (!this.filteredItem.type ||
              part.type
                .toLowerCase()
                .includes(this.filteredItem.type.toLowerCase())) &&
            (!this.filteredItem.amount ||
              part.amount === this.filteredItem.amount) &&
            (!this.filteredItem.depot ||
              part.depot
                .toLowerCase()
                .includes(this.filteredItem.depot.toLowerCase())) &&
            (!this.filteredItem.remarks ||
              (part.remarks &&
                part.remarks
                  .toLowerCase()
                  .includes(this.filteredItem.remarks.toLowerCase())))
          );
        });
        this.sparePartList$.next(filtered);
      } else {
        this.sparePartList$.next(list);
      }
    });
  }

  onDelete(id: string) {
    console.log(id);
    this.api.deleteSparePart(id).subscribe({
      next: (item) => {
        console.log('Successfully deleted', item);
        const updatedList = this.sparePartList$.value.filter(
          (item) => item._id != id
        );
        this.sparePartList$.next(updatedList);
      },
      error: (err) => {
        console.error('Problem deleting', err);
      },
    });
  }

  // onEdit(id: string) {
  //   console.log(id);
  // }

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

  toggleFilterPanel() {
    if (this.filterOpened) {
      this.filterOpened = false;
    } else {
      this.filterOpened = true;
    }
  }
}
