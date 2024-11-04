import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCursoAdminComponent } from './detalle-curso-admin.component';

describe('DetalleCursoAdminComponent', () => {
  let component: DetalleCursoAdminComponent;
  let fixture: ComponentFixture<DetalleCursoAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleCursoAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleCursoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
