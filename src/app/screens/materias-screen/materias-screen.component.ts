import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CustomModalComponent } from 'src/app/modals/custom-modal/custom-modal.component';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-usuario-modal/eliminar-usuario-modal.component';
import { FacadeService } from 'src/app/services/facade.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MateriasService } from 'src/app/services/materias.service';

@Component({
  selector: 'app-materias-screen',
  templateUrl: './materias-screen.component.html',
  styleUrls: ['./materias-screen.component.scss'],
})
export class MateriasScreenComponent implements OnInit {
  public name_user: string = '';
  public rol: string = '';
  public token: string = '';
  public lista_maestros: any[] = [];

  displayedColumnsEdit: string[] = [
    'nrc',
    'nombre',
    'dias',
    'horario',
    'salon',
    'creditos',
    'maestro',
    'editar',
    'eliminar',
  ];

  displayedColumns: string[] = [
    'nrc',
    'nombre',
    'dias',
    'horario',
    'salon',
    'creditos',
    'maestro',
  ];

  dataSource = new MatTableDataSource<DatosUsuario>(
    this.lista_maestros as DatosUsuario[]
  );

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    public facadeService: FacadeService,
    public materiasService: MateriasService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();

    this.displayedColumns =
      this.rol === 'admin' ? this.displayedColumnsEdit : this.displayedColumns;

    //Obtener maestros
    this.obtenerMaterias();
    //Para paginador
    this.initPaginator();
  }

  //Para paginación
  public initPaginator() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      //console.log("Paginator: ", this.dataSourceIngresos.paginator);
      //Modificar etiquetas del paginador a español
      this.paginator._intl.itemsPerPageLabel = 'Registros por página';
      this.paginator._intl.getRangeLabel = (
        page: number,
        pageSize: number,
        length: number
      ) => {
        if (length === 0 || pageSize === 0) {
          return `0 / ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex =
          startIndex < length
            ? Math.min(startIndex + pageSize, length)
            : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };
      this.paginator._intl.firstPageLabel = 'Primera página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Página siguiente';
    }, 500);
    //this.dataSourceIngresos.paginator = this.paginator;
  }

  //Obtener alumnos
  public obtenerMaterias() {
    this.materiasService.obtenerListaMateria().subscribe(
      (response) => {
        this.lista_maestros = response;
        if (this.lista_maestros.length > 0) {
          console.log('Materias: ', this.lista_maestros);

          this.lista_maestros.forEach((materia) => {
            materia.dias = materia.dias_json.join(', ');
            materia.horario = materia.hora_inicio + ' - ' + materia.hora_fin;
            materia.maestro =
              materia.maestro_details.user.first_name +
              ' ' +
              materia.maestro_details.user.last_name;
          });

          this.dataSource = new MatTableDataSource<DatosUsuario>(
            this.lista_maestros as DatosUsuario[]
          );
        }
      },
      (error) => {
        alert('No se pudo obtener la lista de maestros');
      }
    );
  }

  public goEditar(idUser: number) {
    this.router.navigate(['registro-materias/' + idUser]);
  }

  public delete(nrc: number) {
    const dialogRef = this.dialog.open(CustomModalComponent, {
      data: {
        title: 'Eliminar materia',
        message:
          'Estás a punto de eliminar esta materia. Esta acción no se puede deshacer.',
        action: () => this.eliminarMateria(nrc),
        buttonTitle: 'Eliminar materia',
      },
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.iscomplete) {
        console.log('Materia eliminada');
        this.obtenerMaterias();
      } else {
        alert('Materia no eliminada');
        console.log('No se eliminó la materia');
      }
    });
  }

  public eliminarMateria(nrc: number) {
    this.materiasService.eliminarMateria(nrc).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
  }
} //Fin de la clase

export interface DatosUsuario {
  id: number;
  nombre: string;
  dias: string;
  horario: string;
  salon: string;
  creditos: number;
  maestro: string;
}
