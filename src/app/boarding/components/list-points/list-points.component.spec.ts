import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ListPointsComponent} from './list-points.component';

describe('ListPointsComponent', () => {
  let component: ListPointsComponent;
  let fixture: ComponentFixture<ListPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListPointsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
