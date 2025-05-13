import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSaourceComponent } from './edit-saource.component';

describe('EditSaourceComponent', () => {
  let component: EditSaourceComponent;
  let fixture: ComponentFixture<EditSaourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSaourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSaourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
