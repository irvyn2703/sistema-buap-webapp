import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaestrosService } from 'src/app/services/maestros.service';

@Component({
  selector: 'app-registro-maestros',
  templateUrl: './registro-maestros.component.html',
  styleUrls: ['./registro-maestros.component.scss'],
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
    private router: Router
  ) {
    this.maestro.materias_json = [];
  }

  ngOnInit(): void {
    this.maestro = this.maestrosService.esquemaMaestro();
    this.maestro.materias_json = this.maestro.materias_json || [];
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

  public revisarSeleccion(nombre: string) {
    return false;
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

  public regresar() {}

  public actualizar() {}

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
}
