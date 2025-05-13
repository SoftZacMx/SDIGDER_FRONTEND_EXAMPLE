import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSaourceComponent } from './create-saource.component';

describe('CreateSaourceComponent', () => {
  let component: CreateSaourceComponent;
  let fixture: ComponentFixture<CreateSaourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSaourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSaourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
