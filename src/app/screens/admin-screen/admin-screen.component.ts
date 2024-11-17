import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-usuario-modal/eliminar-usuario-modal.component';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-admin-screen',
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.component.scss'],
})
export class AdminScreenComponent implements OnInit {
  public name_user: string = '';
  public rol: string = '';
  public lista_admins: any[] = [];

  constructor(
    private administradoresService: AdministradoresService,
    private facadeService: FacadeService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    //Lista de admins
    this.obtenerAdmins();
  }

  //Obtener lista de usuarios
  public obtenerAdmins() {
    this.administradoresService.obtenerListaAdmins().subscribe(
      (response) => {
        this.lista_admins = response;
        console.log('Lista users: ', this.lista_admins);
      },
      (error) => {
        alert('No se pudo obtener la lista de admins');
      }
    );
  }

  public goEditar(idUser: number) {
    this.router.navigate(['registro-usuarios/admin/' + idUser]);
  }

  public delete(idUser: number) {
    //console.log("User:", idUser);
    const dialogRef = this.dialog.open(EliminarUserModalComponent, {
      data: { id: idUser, rol: 'administrador' }, //Se pasan valores a través del componente
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.isDelete) {
        console.log('Admin eliminado');
        //Recargar página
        window.location.reload();
      } else {
        alert('Administrador no eliminado ');
        console.log('No se eliminó el admin');
      }
    });
  }
}
