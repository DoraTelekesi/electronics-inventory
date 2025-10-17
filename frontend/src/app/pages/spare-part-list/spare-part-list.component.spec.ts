import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SparePartListComponent } from './spare-part-list.component';

describe('SparePartListComponent', () => {
  let component: SparePartListComponent;
  let fixture: ComponentFixture<SparePartListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SparePartListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SparePartListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
