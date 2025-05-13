import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListsUsersComponent } from './lists-users.component';

describe('ListsUsersComponent', () => {
  let component: ListsUsersComponent;
  let fixture: ComponentFixture<ListsUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListsUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListsUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
