import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SaveDossierComponent} from './save-dossier.component';

describe('SaveDossierComponent', () => {
  let component: SaveDossierComponent;
  let fixture: ComponentFixture<SaveDossierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaveDossierComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SaveDossierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
