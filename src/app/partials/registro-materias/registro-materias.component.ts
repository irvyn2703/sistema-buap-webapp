import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MateriasService } from 'src/app/services/materias.service';

@Component({
  selector: 'app-registro-materias',
  templateUrl: './registro-materias.component.html',
  styleUrls: ['./registro-materias.component.scss'],
})
export class RegistroMateriasComponent implements OnInit {
  public errors: any = {};
  public materia: any = {};
  public editar: boolean = false;
  public token: string = '';

  public dias: any[] = [
    { value: '1', nombre: 'Lunes' },
    { value: '2', nombre: 'Martes' },
    { value: '3', nombre: 'Miercoles' },
    { value: '4', nombre: 'Jueves' },
    { value: '5', nombre: 'Viernes' },
    { value: '6', nombre: 'Sabado' },
  ];

  public programas: any[] = [
    { value: '1', viewValue: 'Ingeniería en Ciencias de la Computación' },
    { value: '2', viewValue: 'Licenciatura en Ciencias de la Computación' },
    { value: '3', viewValue: 'Ingeniería en Tecnologías de la Información' },
  ];

  public maestros: any[] = [];

  constructor(
    private maestrosService: MaestrosService,
    private materiaService: MateriasService,
    private location: Location,
    private router: Router
  ) {
    this.materia.dias_json = [];
  }

  ngOnInit(): void {
    this.getMaestros();
  }

  public getMaestros() {
    this.maestrosService.obtenerListaMaestros().subscribe(
      (response) => {
        this.maestros = response.map((maestro: any) => ({
          value: maestro.id,
          viewValue: `${maestro.user.first_name} ${maestro.user.last_name}`,
        }));
        console.log(this.maestros);
      },
      (error) => {
        alert('No se pudo obtener la lista');
      }
    );
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

  public soloNumerosLetrasEspacios(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir letras mayúsculas, minúsculas, números (0-9) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) && // Letras mayúsculas (A-Z)
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas (a-z)
      !(charCode >= 48 && charCode <= 57) && // Números (0-9)
      charCode !== 32 // Espacio
    ) {
      event.preventDefault();
    }
  }

  public checkboxChange(event: any) {
    console.log('Evento: ', event);
    if (event.checked) {
      this.materia.dias_json.push(event.source.value);
    } else {
      console.log(event.source.value);
      this.materia.dias_json.forEach((dia, i) => {
        if (dia == event.source.value) {
          this.materia.dias_json.splice(i, 1);
        }
      });
    }
    console.log('Array dias: ', this.materia);
  }

  public revisarSeleccion(nombre: string): boolean {
    return this.materia.dias_json.includes(nombre);
  }

  public actualizar() {}

  public regresar() {
    this.location.back();
  }

  public registrar() {
    this.errors = this.materiaService.validarMateria(this.materia);

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    this.materiaService.registrarMateria(this.materia).subscribe(
      (response) => {
        //Aquí va la ejecución del servicio si todo es correcto
        alert('Materia registrada correctamente');
        console.log('Materia registrado: ', response);
        if (this.token != '') {
          this.router.navigate(['home']);
        } else {
          this.router.navigate(['home']);
        }
      },
      (error) => {
        //Aquí se ejecuta el error
        alert('No se pudo registrar la materia');
        console.log('No se pudo registrar la materia: ', error);
      }
    );
    console.log('materia validada correctamente', this.materia);
  }
}
