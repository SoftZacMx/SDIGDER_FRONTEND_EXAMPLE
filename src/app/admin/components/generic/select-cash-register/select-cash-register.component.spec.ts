import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCashRegisterComponent } from './select-cash-register.component';

describe('SelectCashRegisterComponent', () => {
  let component: SelectCashRegisterComponent;
  let fixture: ComponentFixture<SelectCashRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectCashRegisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectCashRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
