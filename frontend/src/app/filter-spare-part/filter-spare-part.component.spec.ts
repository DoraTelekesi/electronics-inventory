import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSparePartComponent } from './filter-spare-part.component';

describe('FilterSparePartComponent', () => {
  let component: FilterSparePartComponent;
  let fixture: ComponentFixture<FilterSparePartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterSparePartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterSparePartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
