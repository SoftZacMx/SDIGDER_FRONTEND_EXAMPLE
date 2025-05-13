import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesSaourcesEditionComponent } from './categories-saources-edition.component';

describe('CategoriesSaourcesEditionComponent', () => {
  let component: CategoriesSaourcesEditionComponent;
  let fixture: ComponentFixture<CategoriesSaourcesEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriesSaourcesEditionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesSaourcesEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
