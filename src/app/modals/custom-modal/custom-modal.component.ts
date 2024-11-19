import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdministradoresService } from '../../services/administradores.service';
import { AlumnoService } from '../../services/alumno.service';
import { MaestrosService } from '../../services/maestros.service';

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.scss'],
})
export class CustomModalComponent {
  public title: string = '';
  public message: string = '';
  public buttonTitle: string = '';
  public action!: () => void;

  constructor(
    private dialogRef: MatDialogRef<CustomModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.title = this.data.title;
    this.message = this.data.message;
    this.action = this.data.action;
    this.buttonTitle = this.data.buttonTitle;
  }

  public cerrar_modal() {
    this.dialogRef.close({ iscomplete: false });
  }

  public confirmarAccion() {
    try {
      this.action();
      this.dialogRef.close({ iscomplete: true });
    } catch (error) {
      this.dialogRef.close({ iscomplete: false });
    }
  }
}
