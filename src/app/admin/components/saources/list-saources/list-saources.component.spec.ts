import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSaourcesComponent } from './list-saources.component';

describe('ListSaourcesComponent', () => {
  let component: ListSaourcesComponent;
  let fixture: ComponentFixture<ListSaourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSaourcesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSaourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
