import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaourceCardComponent } from './saource-card.component';

describe('SaourceCardComponent', () => {
  let component: SaourceCardComponent;
  let fixture: ComponentFixture<SaourceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaourceCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaourceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
