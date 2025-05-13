import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBussinesServicesComponent } from './list-bussines-services.component';

describe('ListBussinesServicesComponent', () => {
  let component: ListBussinesServicesComponent;
  let fixture: ComponentFixture<ListBussinesServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListBussinesServicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListBussinesServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
