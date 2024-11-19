import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomModalComponent } from 'src/app/modals/custom-modal/custom-modal.component';
import { MaestrosService } from 'src/app/services/maestros.service';

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
  selector: 'app-registro-maestros',
  templateUrl: './registro-maestros.component.html',
  styleUrls: ['./registro-maestros.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }, // Configura el locale en español
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, // Aplica los formatos personalizados
  ],
})
export class RegistroMaestrosComponent implements OnInit {
  @Input() rol: string = '';
  @Input() datos_user: any = {};

  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public maestro: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public token: string = '';
  public idUser: Number = 0;

  public areas: any[] = [
    { value: '1', viewValue: 'Desarrollo Web' },
    { value: '2', viewValue: 'Programación' },
    { value: '3', viewValue: 'Bases de datos' },
    { value: '4', viewValue: 'Redes' },
    { value: '5', viewValue: 'Matemáticas' },
  ];

  public materias: any[] = [
    { value: '1', nombre: 'Aplicaciones Web' },
    { value: '2', nombre: 'Programación 1' },
    { value: '3', nombre: 'Bases de datos' },
    { value: '4', nombre: 'Tecnologías Web' },
    { value: '5', nombre: 'Minería de datos' },
    { value: '6', nombre: 'Desarrollo móvil' },
    { value: '7', nombre: 'Estructuras de datos' },
    { value: '8', nombre: 'Administración de redes' },
    { value: '9', nombre: 'Ingeniería de Software' },
    { value: '10', nombre: 'Administración de S.O.' },
  ];

  constructor(
    private maestrosService: MaestrosService,
    private adapter: DateAdapter<any>,
    private router: Router,
    private location: Location,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.maestro.materias_json = [];
  }

  ngOnInit(): void {
    this.adapter.setLocale('es-ES');

    //El primer if valida si existe un parámetro en la URL
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log('ID User: ', this.idUser);
      //Al iniciar la vista asignamos los datos del user
      this.maestro = this.datos_user;
    } else {
      this.maestro = this.maestrosService.esquemaMaestro();
      this.maestro.materias_json = this.maestro.materias_json || [];
    }
    //Imprimir datos en consola
    console.log('Maestro: ', this.maestro);
  }

  public checkboxChange(event: any) {
    console.log('Evento: ', event);
    if (event.checked) {
      this.maestro.materias_json.push(event.source.value);
    } else {
      console.log(event.source.value);
      this.maestro.materias_json.forEach((materia, i) => {
        if (materia == event.source.value) {
          this.maestro.materias_json.splice(i, 1);
        }
      });
    }
    console.log('Array materias: ', this.maestro);
  }

  public revisarSeleccion(nombre: string): boolean {
    return this.maestro.materias_json.includes(nombre);
  }

  showPassword() {
    if (this.inputType_1 == 'password') {
      this.inputType_1 = 'text';
      this.hide_1 = true;
    } else {
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  showPwdConfirmar() {
    if (this.inputType_2 == 'password') {
      this.inputType_2 = 'text';
      this.hide_2 = true;
    } else {
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  public regresar() {
    this.location.back();
  }

  public actualizar() {
    //Validación
    this.errors = [];

    this.errors = this.maestrosService.validarMaestro(
      this.maestro,
      this.editar
    );

    if (Object.keys(this.errors).length > 0) {
      return false;
    }
    console.log('Pasó la validación');

    const dialogRef = this.dialog.open(CustomModalComponent, {
      data: {
        title: 'Editar maestro',
        message:
          'Estás a punto de editar este profesor. Esta acción no se puede deshacer.',
        action: () => this.editarMaestro(),
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

  public editarMaestro() {
    this.maestrosService.editarMaestro(this.maestro).subscribe(
      (response) => {
        alert('Maestro editado correctamente');
        console.log('Maestro editado: ', response);
      },
      (error) => {
        alert('No se pudo editar el maestro');
      }
    );
  }

  public registrar() {
    console.log(this.maestro);
    //Validar
    this.errors = this.maestrosService.validarMaestro(
      this.maestro,
      this.editar
    );

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    //Validar la contraseña
    if (this.maestro.password == this.maestro.confirmar_password) {
      this.maestrosService.registrarMaestro(this.maestro).subscribe(
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
      this.maestro.password = '';
      this.maestro.confirmar_password = '';
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
