import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSaleTicketComponent } from './create-sale-ticket.component';

describe('CreateSaleTicketComponent', () => {
  let component: CreateSaleTicketComponent;
  let fixture: ComponentFixture<CreateSaleTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSaleTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSaleTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
