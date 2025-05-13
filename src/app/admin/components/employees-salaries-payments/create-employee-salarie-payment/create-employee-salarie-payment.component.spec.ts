import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEmployeeSalariePaymentComponent } from './create-employee-salarie-payment.component';

describe('CreateEmployeeSalariePaymentComponent', () => {
  let component: CreateEmployeeSalariePaymentComponent;
  let fixture: ComponentFixture<CreateEmployeeSalariePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEmployeeSalariePaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEmployeeSalariePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
