import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomModalComponent } from 'src/app/modals/custom-modal/custom-modal.component';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { FacadeService } from 'src/app/services/facade.service';
declare var $: any;

@Component({
  selector: 'app-registro-admin',
  templateUrl: './registro-admin.component.html',
  styleUrls: ['./registro-admin.component.scss'],
})
export class RegistroAdminComponent implements OnInit {
  @Input() rol: string = '';
  @Input() datos_user: any = {};

  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public admin: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public token: string = '';
  public idUser: Number = 0;

  constructor(
    private administradoresService: AdministradoresService,
    private router: Router,
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    //El primer if valida si existe un parámetro en la URL
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log('ID User: ', this.idUser);
      //Al iniciar la vista asignamos los datos del user
      this.admin = this.datos_user;
    } else {
      this.admin = this.administradoresService.esquemaAdmin();
      this.admin.rol = this.rol;
      this.token = this.facadeService.getSessionToken();
    }
    //Imprimir datos en consola
    console.log('Admin: ', this.admin);
  }

  //Funciones para password
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

  public registrar() {
    //Validar
    this.errors = [];

    this.errors = this.administradoresService.validarAdmin(
      this.admin,
      this.editar
    );
    if (!$.isEmptyObject(this.errors)) {
      return false;
    }

    //Validar la contraseña
    if (this.admin.password == this.admin.confirmar_password) {
      this.administradoresService.registrarAdmin(this.admin).subscribe(
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
      this.admin.password = '';
      this.admin.confirmar_password = '';
    }
  }

  public actualizar() {
    //Validación
    this.errors = [];

    this.errors = this.administradoresService.validarAdmin(
      this.admin,
      this.editar
    );
    if (!$.isEmptyObject(this.errors)) {
      return false;
    }
    console.log('Pasó la validación');

    const dialogRef = this.dialog.open(CustomModalComponent, {
      data: {
        title: 'Editar maestro',
        message:
          'Estás a punto de editar este profesor. Esta acción no se puede deshacer.',
        action: () => this.editarAdmin(),
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

  public editarAdmin() {
    this.administradoresService.editarAdmin(this.admin).subscribe(
      (response) => {
        alert('Administrador editado correctamente');
        console.log('Admin editado: ', response);
      },
      (error) => {
        alert('No se pudo editar el administrador');
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
}
