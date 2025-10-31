import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FilterSparePart } from '../interfaces/spare-part';

@Component({
  selector: 'app-filter-spare-part',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './filter-spare-part.component.html',
  styleUrl: './filter-spare-part.component.scss',
})
export class FilterSparePartComponent {
  @Output() searchedItem = new EventEmitter<FilterSparePart>();
  @Output() clearedFilter = new EventEmitter<boolean>();


  constructor(private formBuilder: FormBuilder) {}
  filterForm = this.formBuilder.group({
    manufacturer: [''],
    model: [''],
    type: [''],
    depot: [''],
    amount: [''],
    remarks: [''],
  });

  onSubmit() {
    this.searchedItem.emit(this.filterForm.value as FilterSparePart);
  }

  clearFilter(){
    this.filterForm.setValue({manufacturer:"", model:"", type:"", depot:"",amount:"", remarks:""})
    this.clearedFilter.emit()
  }
}
