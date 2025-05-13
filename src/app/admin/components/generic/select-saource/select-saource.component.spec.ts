import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSaourceComponent } from './select-saource.component';

describe('SelectSaourceComponent', () => {
  let component: SelectSaourceComponent;
  let fixture: ComponentFixture<SelectSaourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectSaourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectSaourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
