import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmployeeSalariePaymentComponent } from './edit-employee-salarie-payment.component';

describe('EditEmployeeSalariePaymentComponent', () => {
  let component: EditEmployeeSalariePaymentComponent;
  let fixture: ComponentFixture<EditEmployeeSalariePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEmployeeSalariePaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEmployeeSalariePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
