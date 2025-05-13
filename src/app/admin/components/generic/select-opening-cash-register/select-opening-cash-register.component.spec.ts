import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOpeningCashRegisterComponent } from './select-opening-cash-register.component';

describe('SelectOpeningCashRegisterComponent', () => {
  let component: SelectOpeningCashRegisterComponent;
  let fixture: ComponentFixture<SelectOpeningCashRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectOpeningCashRegisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectOpeningCashRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
