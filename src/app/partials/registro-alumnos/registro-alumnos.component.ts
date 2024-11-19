import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';
import { AlumnoService } from 'src/app/services/alumno.service';
import { CustomModalComponent } from 'src/app/modals/custom-modal/custom-modal.component';
import { MatDialog } from '@angular/material/dialog';

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
  public token: string = '';
  public idUser: Number = 0;

  constructor(
    private alumnoService: AlumnoService,
    private adapter: DateAdapter<any>,
    private router: Router,
    private location: Location,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.adapter.setLocale('es-ES');
    //El primer if valida si existe un parámetro en la URL
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log('ID User: ', this.idUser);
      //Al iniciar la vista asignamos los datos del user
      this.alumno = this.datos_user;
    } else {
      this.alumno = this.alumnoService.esquemaAlumno();
    }
    //Imprimir datos en consola
    console.log('Alumno: ', this.alumno);
  }

  showPassword() {
    this.inputType_1 = this.inputType_1 === 'password' ? 'text' : 'password';
    this.hide_1 = !this.hide_1;
  }

  showPwdConfirmar() {
    this.inputType_2 = this.inputType_2 === 'password' ? 'text' : 'password';
    this.hide_2 = !this.hide_2;
  }

  public regresar() {
    this.location.back();
  }

  public actualizar() {
    //Validación
    this.errors = [];

    this.errors = this.alumnoService.validarAlumno(this.alumno, this.editar);

    if (Object.keys(this.errors).length > 0) {
      return false;
    }
    console.log('Pasó la validación');

    const dialogRef = this.dialog.open(CustomModalComponent, {
      data: {
        title: 'Editar maestro',
        message:
          'Estás a punto de editar este profesor. Esta acción no se puede deshacer.',
        action: () => this.editarAlumno(),
        buttonTitle: 'Editar',
      },
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.iscomplete) {
        console.log('Materia editada');
        this.router.navigate(['home']);
      } else {
        alert('Materia no editada');
        console.log('No se edito la materia');
      }
    });
  }

  public editarAlumno() {
    this.alumnoService.editarAlumno(this.alumno).subscribe(
      (response) => {
        alert('Alumno editado correctamente');
        console.log('Alumno editado: ', response);
      },
      (error) => {
        alert('No se pudo editar el alumno');
      }
    );
  }

  public registrar() {
    console.log(this.alumno);
    //Validar
    this.errors = this.alumnoService.validarAlumno(this.alumno, this.editar);

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    if (this.alumno.password == this.alumno.confirmar_password) {
      this.alumnoService.registrarAlumno(this.alumno).subscribe(
        (response) => {
          //Aquí va la ejecución del servicio si todo es correcto
          alert('Usuario registrado correctamente');
          console.log('Usuario registrado: ', response);
          if (this.token != '') {
            this.router.navigate(['home']);
          } else {
            this.router.navigate(['/']);
          }
        },
        (error) => {
          //Aquí se ejecuta el error
          alert('No se pudo registrar usuario');
        }
      );
    } else {
      alert('Las contraseñas no coinciden');
      this.alumno.password = '';
      this.alumno.confirmar_password = '';
    }
  }

  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayúsculas y minúsculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) && // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32 // Espacio
    ) {
      event.preventDefault();
    }
  }

  public soloNumeros(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo números (0-9)
    if (!(charCode >= 48 && charCode <= 57)) {
      event.preventDefault();
    }
  }
}
