import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registro-materias',
  templateUrl: './registro-materias.component.html',
  styleUrls: ['./registro-materias.component.scss'],
})
export class RegistroMateriasComponent implements OnInit {
  public errors: any = {};
  public materia: any = {};
  public editar: boolean = false;

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

  public profesores: any[] = [];

  constructor() {
    this.materia.dias_json = [];
  }

  ngOnInit(): void {}

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

  public regresar() {}

  public registrar() {
    console.log(this.materia);
  }
}
