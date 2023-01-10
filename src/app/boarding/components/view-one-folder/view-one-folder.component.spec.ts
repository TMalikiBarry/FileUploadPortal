import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ViewOneFolderComponent} from './view-one-folder.component';

describe('ViewOneFolderComponent', () => {
  let component: ViewOneFolderComponent;
  let fixture: ComponentFixture<ViewOneFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewOneFolderComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ViewOneFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
