import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarUsuarioModalComponent } from './eliminar-usuario-modal.component';

describe('EliminarUsuarioModalComponent', () => {
  let component: EliminarUsuarioModalComponent;
  let fixture: ComponentFixture<EliminarUsuarioModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EliminarUsuarioModalComponent]
    });
    fixture = TestBed.createComponent(EliminarUsuarioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
