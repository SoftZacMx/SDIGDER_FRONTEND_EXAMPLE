import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesSaourcesListComponent } from './categories-saources-list.component';

describe('CategoriesSaourcesListComponent', () => {
  let component: CategoriesSaourcesListComponent;
  let fixture: ComponentFixture<CategoriesSaourcesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriesSaourcesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesSaourcesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
