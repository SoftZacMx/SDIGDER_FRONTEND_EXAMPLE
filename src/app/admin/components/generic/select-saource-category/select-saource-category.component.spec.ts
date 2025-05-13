import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSaourceCategoryComponent } from './select-saource-category.component';

describe('SelectSaourceCategoryComponent', () => {
  let component: SelectSaourceCategoryComponent;
  let fixture: ComponentFixture<SelectSaourceCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectSaourceCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectSaourceCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
