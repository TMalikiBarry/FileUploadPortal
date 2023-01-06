import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfigFolderComponent} from './config-folder.component';

describe('ConfigFolderComponent', () => {
  let component: ConfigFolderComponent;
  let fixture: ComponentFixture<ConfigFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigFolderComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ConfigFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
