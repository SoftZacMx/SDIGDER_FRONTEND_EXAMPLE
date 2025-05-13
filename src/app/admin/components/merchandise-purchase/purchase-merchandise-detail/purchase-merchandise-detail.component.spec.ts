import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseMerchandiseDetailComponent } from './purchase-merchandise-detail.component';

describe('PurchaseMerchandiseDetailComponent', () => {
  let component: PurchaseMerchandiseDetailComponent;
  let fixture: ComponentFixture<PurchaseMerchandiseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseMerchandiseDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseMerchandiseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
