import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Input() tipo: string = '';
  @Input() rol: string = '';

  public token: string = '';
  public editar: boolean = false;

  constructor(
    private facadeService: FacadeService,
    public activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.rol = this.facadeService.getUserGroup();
    console.log('Rol user: ', this.rol);
    //Validar que haya inicio de sesión
    //Obtengo el token del login
    this.token = this.facadeService.getSessionToken();
    //El primer if valida si existe un parámetro en la URL
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
    }
  }

  public goRegistro({ go }) {
    switch (go) {
      case 'alumnos':
        this.router.navigate(['registro-usuarios']);

        break;
      case 'maestros':
        this.router.navigate(['registro-usuarios']);

        break;
      case 'materias':
        this.router.navigate(['registro-materias']);
        break;
      default:
        alert('error en la navegación');
        break;
    }
  }
  //Cerrar sesión
  public logout() {
    this.facadeService.logout().subscribe(
      (response) => {
        console.log('Entró');

        this.facadeService.destroyUser();
        //Navega al login
        this.router.navigate(['/']);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public clickNavLink(link: string) {
    this.router.navigate([link]);
    setTimeout(() => {
      this.activarLink(link);
    }, 100);
  }
  public activarLink(link: string) {
    if (link == 'alumnos') {
      $('#alumno').addClass('active');
      $('#principal').removeClass('active');
      $('#maestro').removeClass('active');
      $('#listaMateria').removeClass('active');
    } else if (link == 'maestros') {
      $('#maestro').addClass('active');
      $('#principal').removeClass('active');
      $('#alumno').removeClass('active');
      $('#listaMateria').removeClass('active');
    } else if (link == 'home') {
      $('#principal').addClass('active');
      $('#alumno').removeClass('active');
      $('#maestro').removeClass('active');
      $('#listaMateria').removeClass('active');
    } else if (link == 'graficas') {
      $('#graficas').addClass('active');
      $('#alumno').removeClass('active');
      $('#maestro').removeClass('active');
      $('#principal').removeClass('active');
      $('#listaMateria').removeClass('active');
    } else if (link == 'listaMateria') {
      $('#listaMateria').addClass('active');
      $('#graficas').removeClass('active');
      $('#alumno').removeClass('active');
      $('#maestro').removeClass('active');
      $('#principal').removeClass('active');
    }
  }
}
