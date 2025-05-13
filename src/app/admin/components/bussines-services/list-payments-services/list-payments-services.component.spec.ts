import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPaymentsServicesComponent } from './list-payments-services.component';

describe('ListPaymentsServicesComponent', () => {
  let component: ListPaymentsServicesComponent;
  let fixture: ComponentFixture<ListPaymentsServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPaymentsServicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPaymentsServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
