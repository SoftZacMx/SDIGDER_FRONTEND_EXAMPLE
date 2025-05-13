import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMerchandisePurchaseComponent } from './create-merchandise-purchase.component';

describe('CreateMerchandisePurchaseComponent', () => {
  let component: CreateMerchandisePurchaseComponent;
  let fixture: ComponentFixture<CreateMerchandisePurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMerchandisePurchaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMerchandisePurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
