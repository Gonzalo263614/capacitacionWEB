import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestajefeComponent } from './encuestajefe.component';

describe('EncuestajefeComponent', () => {
  let component: EncuestajefeComponent;
  let fixture: ComponentFixture<EncuestajefeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EncuestajefeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncuestajefeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
