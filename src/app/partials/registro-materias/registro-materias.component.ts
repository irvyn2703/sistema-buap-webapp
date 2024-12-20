import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomModalComponent } from 'src/app/modals/custom-modal/custom-modal.component';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MateriasService } from 'src/app/services/materias.service';

@Component({
  selector: 'app-registro-materias',
  templateUrl: './registro-materias.component.html',
  styleUrls: ['./registro-materias.component.scss'],
})
export class RegistroMateriasComponent implements OnInit {
  @Input() datos_materia: any = {};

  public errors: any = {};
  public materia: any = {};
  public editar: boolean = false;
  public token: string = '';
  public nrc: number = 0;

  public dias: any[] = [
    { value: '1', nombre: 'Lunes' },
    { value: '2', nombre: 'Martes' },
    { value: '3', nombre: 'Miércoles' },
    { value: '4', nombre: 'Jueves' },
    { value: '5', nombre: 'Viernes' },
    { value: '6', nombre: 'Sábado' },
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
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.materia.dias_json = [];
  }

  ngOnInit(): void {
    this.getMaestros();
    if (this.activatedRoute.snapshot.params['nrc'] != undefined) {
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.nrc = this.activatedRoute.snapshot.params['nrc'];
      console.log('nrc: ', this.nrc);

      this.getMateriarByNRC();
    } else {
    }
  }

  public getMateriarByNRC() {
    this.materiaService.getMateriaByNRC(this.nrc).subscribe(
      (response) => {
        this.materia = response;
        this.materia.maestro = response.maestro_details.id;

        console.log('Datos de la materia: ', this.materia);
      },
      (error) => {
        alert('No se pudieron obtener los datos del usuario para editar');
      }
    );
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

  public actualizar() {
    //Validación
    this.errors = [];

    this.errors = this.materiaService.validarMateria(this.materia);

    if (Object.keys(this.errors).length > 0) {
      return false;
    }

    console.log('Pasó la validación');

    const dialogRef = this.dialog.open(CustomModalComponent, {
      data: {
        title: 'Editar materia',
        message:
          'Estás a punto de editar esta materia. Esta acción no se puede deshacer.',
        action: () => this.editarMateria(),
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

  public editarMateria() {
    this.materiaService.editarMateria(this.materia).subscribe(
      (response) => {
        alert('Materia editada correctamente');
        console.log('Materia editado: ', response);
        //Si se editó, entonces mandar al home
        this.router.navigate(['home']);
      },
      (error) => {
        alert('No se pudo editar el maestro');
      }
    );
  }

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
