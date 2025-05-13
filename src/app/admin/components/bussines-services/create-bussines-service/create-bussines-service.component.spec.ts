import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBussinesServiceComponent } from './create-bussines-service.component';

describe('CreateBussinesServiceComponent', () => {
  let component: CreateBussinesServiceComponent;
  let fixture: ComponentFixture<CreateBussinesServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBussinesServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBussinesServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
