import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ViewFoldersComponent} from './view-folders.component';

describe('ViewFoldersComponent', () => {
  let component: ViewFoldersComponent;
  let fixture: ComponentFixture<ViewFoldersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewFoldersComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ViewFoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
