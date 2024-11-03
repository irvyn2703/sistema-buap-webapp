import { Component, OnInit } from '@angular/core';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-admin-screen',
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.component.scss'],
})
export class AdminScreenComponent implements OnInit {
  public name_user: string = '';
  public lista_admins: any[] = [];

  constructor(
    private administradoresService: AdministradoresService,
    private facadeService: FacadeService
  ) {}

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
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

  public goEditar(idUser: number) {}

  public delete(idUser: number) {}
}
