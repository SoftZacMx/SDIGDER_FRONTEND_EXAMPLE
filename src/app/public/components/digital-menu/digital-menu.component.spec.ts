import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalMenuComponent } from './digital-menu.component';

describe('DigitalMenuComponent', () => {
  let component: DigitalMenuComponent;
  let fixture: ComponentFixture<DigitalMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DigitalMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigitalMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
