import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesSaourcesCreationComponent } from './categories-saources-creation.component';

describe('CategoriesSaourcesCreationComponent', () => {
  let component: CategoriesSaourcesCreationComponent;
  let fixture: ComponentFixture<CategoriesSaourcesCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriesSaourcesCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesSaourcesCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
