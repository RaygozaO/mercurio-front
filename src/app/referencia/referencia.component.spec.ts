import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenciaComponent } from './referencia.component';

describe('ReferenciaComponent', () => {
  let component: ReferenciaComponent;
  let fixture: ComponentFixture<ReferenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
