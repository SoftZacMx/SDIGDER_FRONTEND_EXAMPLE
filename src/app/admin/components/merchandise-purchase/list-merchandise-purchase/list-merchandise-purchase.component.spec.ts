import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMerchandisePurchaseComponent } from './list-merchandise-purchase.component';

describe('ListMerchandisePurchaseComponent', () => {
  let component: ListMerchandisePurchaseComponent;
  let fixture: ComponentFixture<ListMerchandisePurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMerchandisePurchaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMerchandisePurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
