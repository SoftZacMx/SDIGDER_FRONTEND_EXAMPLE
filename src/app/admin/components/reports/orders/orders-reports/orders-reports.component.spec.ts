import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersReportsComponent } from './orders-reports.component';

describe('OrdersReportsComponent', () => {
  let component: OrdersReportsComponent;
  let fixture: ComponentFixture<OrdersReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
