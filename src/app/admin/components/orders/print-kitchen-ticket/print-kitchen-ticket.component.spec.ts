import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintKitchenTicketComponent } from './print-kitchen-ticket.component';

describe('PrintKitchenTicketComponent', () => {
  let component: PrintKitchenTicketComponent;
  let fixture: ComponentFixture<PrintKitchenTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintKitchenTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintKitchenTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
