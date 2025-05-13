import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCashRegistersComponent } from './edit-cash-registers.component';

describe('EditCashRegistersComponent', () => {
  let component: EditCashRegistersComponent;
  let fixture: ComponentFixture<EditCashRegistersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCashRegistersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCashRegistersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
