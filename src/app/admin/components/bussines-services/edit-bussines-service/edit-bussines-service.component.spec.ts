import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBussinesServiceComponent } from './edit-bussines-service.component';

describe('EditBussinesServiceComponent', () => {
  let component: EditBussinesServiceComponent;
  let fixture: ComponentFixture<EditBussinesServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBussinesServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBussinesServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
