import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-usuario-modal/eliminar-usuario-modal.component';
import { AlumnoService } from 'src/app/services/alumno.service';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-alumnos-screen',
  templateUrl: './alumnos-screen.component.html',
  styleUrls: ['./alumnos-screen.component.scss'],
})
export class AlumnosScreenComponent implements OnInit {
  public name_user: string = '';
  public rol: string = '';
  public token: string = '';
  public lista_alumnos: any[] = [];

  displayedColumns: string[] = [
    'id_trabajador',
    'nombre',
    'email',
    'fecha_nacimiento',
    'telefono',
    'rfc',
    'edad',
  ];

  displayedColumnsEdit: string[] = [
    'id_trabajador',
    'nombre',
    'email',
    'fecha_nacimiento',
    'telefono',
    'rfc',
    'edad',
    'editar',
    'eliminar',
  ];

  dataSource = new MatTableDataSource<DatosAlumno>(
    this.lista_alumnos as DatosAlumno[]
  );

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    public facadeService: FacadeService,
    public alumnosService: AlumnoService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();

    this.displayedColumns =
      this.rol === 'admin' ? this.displayedColumnsEdit : this.displayedColumns;

    // Obtener alumnos
    this.obtenerAlumnos();
    // Inicializar el paginador
    this.initPaginator();
  }

  public initPaginator() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
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
  }

  public obtenerAlumnos() {
    this.alumnosService.obtenerListaAlumnos().subscribe(
      (response) => {
        this.lista_alumnos = response;
        console.log('Lista alumnos: ', this.lista_alumnos);
        if (this.lista_alumnos.length > 0) {
          this.lista_alumnos.forEach((alumno) => {
            alumno.first_name = alumno.user.first_name;
            alumno.last_name = alumno.user.last_name;
            alumno.email = alumno.user.email;
          });
          this.dataSource = new MatTableDataSource<DatosAlumno>(
            this.lista_alumnos as DatosAlumno[]
          );
        }
      },
      (error) => {
        alert('No se pudo obtener la lista de alumnos');
      }
    );
  }

  public goEditar(idUser: number) {
    this.router.navigate(['registro-usuarios/alumno/' + idUser]);
  }

  public delete(idUser: number) {
    //console.log("User:", idUser);
    const dialogRef = this.dialog.open(EliminarUserModalComponent, {
      data: { id: idUser, rol: 'alumno' }, //Se pasan valores a través del componente
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.isDelete) {
        console.log('Alumno eliminado');
        //Recargar página
        window.location.reload();
      } else {
        alert('Alumno no eliminado ');
        console.log('No se eliminó el admin');
      }
    });
  }
}

export interface DatosAlumno {
  id: number;
  id_trabajador: number;
  first_name: string;
  last_name: string;
  email: string;
  fecha_nacimiento: string;
  telefono: string;
  rfc: string;
  edad: number;
}
