import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMerchandisePurchaseComponent } from './edit-merchandise-purchase.component';

describe('EditMerchandisePurchaseComponent', () => {
  let component: EditMerchandisePurchaseComponent;
  let fixture: ComponentFixture<EditMerchandisePurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMerchandisePurchaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMerchandisePurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
