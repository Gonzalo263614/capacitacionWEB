import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdirectorComponent } from './subdirector.component';

describe('SubdirectorComponent', () => {
  let component: SubdirectorComponent;
  let fixture: ComponentFixture<SubdirectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubdirectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubdirectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
