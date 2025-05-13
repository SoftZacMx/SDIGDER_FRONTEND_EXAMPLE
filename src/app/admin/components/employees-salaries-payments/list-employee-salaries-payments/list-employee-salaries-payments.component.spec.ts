import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEmployeeSalariesPaymentsComponent } from './list-employee-salaries-payments.component';

describe('ListEmployeeSalariesPaymentsComponent', () => {
  let component: ListEmployeeSalariesPaymentsComponent;
  let fixture: ComponentFixture<ListEmployeeSalariesPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEmployeeSalariesPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListEmployeeSalariesPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
