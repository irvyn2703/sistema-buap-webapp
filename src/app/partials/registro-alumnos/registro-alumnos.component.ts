import { Component, Input, OnInit } from '@angular/core';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';
import { AlumnoService } from 'src/app/services/alumno.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-registro-alumnos',
  templateUrl: './registro-alumnos.component.html',
  styleUrls: ['./registro-alumnos.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }, // Configura el locale en español
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, // Aplica los formatos personalizados
  ],
})
export class RegistroAlumnosComponent implements OnInit {
  @Input() rol: string = '';
  @Input() datos_user: any = {};

  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public alumno: any = {};
  public errors: any = {};
  public editar: boolean = false;

  constructor(
    private alumnoService: AlumnoService,
    private adapter: DateAdapter<any>
  ) {}

  ngOnInit(): void {
    this.adapter.setLocale('es-ES');
  }

  showPassword() {
    this.inputType_1 = this.inputType_1 === 'password' ? 'text' : 'password';
    this.hide_1 = !this.hide_1;
  }

  showPwdConfirmar() {
    this.inputType_2 = this.inputType_2 === 'password' ? 'text' : 'password';
    this.hide_2 = !this.hide_2;
  }

  public regresar() {}

  public actualizar() {}

  public registrar() {
    console.log(this.alumno);
    //Validar
    this.errors = this.alumnoService.validarAlumno(this.alumno, this.editar);

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    if (this.alumno.password == this.alumno.confirmar_password) {
      alert('todos los campos son correctos');
    } else {
      alert('Las contraseñas no coinciden');
      this.alumno.password = '';
      this.alumno.confirmar_password = '';
    }
  }
}
