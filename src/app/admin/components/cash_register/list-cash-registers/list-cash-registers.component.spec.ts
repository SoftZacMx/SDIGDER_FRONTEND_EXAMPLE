import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCashRegistersComponent } from './list-cash-registers.component';

describe('ListCashRegistersComponent', () => {
  let component: ListCashRegistersComponent;
  let fixture: ComponentFixture<ListCashRegistersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCashRegistersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCashRegistersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
