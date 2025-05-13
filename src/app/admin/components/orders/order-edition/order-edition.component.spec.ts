import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEditionComponent } from './order-edition.component';

describe('OrderEditionComponent', () => {
  let component: OrderEditionComponent;
  let fixture: ComponentFixture<OrderEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderEditionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
