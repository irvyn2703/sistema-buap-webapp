import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AlumnoService {
  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService
  ) {}

  // Esquema para el alumno
  public esquemaAlumno() {
    return {
      rol: 'alumno',
      clave: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmar_password: '',
      fecha_nacimiento: '',
      curp: '',
      rfc: '',
      edad: null,
      telefono: '',
      ocupacion: '',
    };
  }

  // Validación para el formulario de alumno
  public validarAlumno(data: any, editar: boolean) {
    console.log('Validando alumno... ', data);

    let error: any = [];

    if (!this.validatorService.required(data['clave'])) {
      error['clave'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['first_name'])) {
      error['first_name'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['last_name'])) {
      error['last_name'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['email'])) {
      error['email'] = this.errorService.required;
    } else if (!this.validatorService.max(data['email'], 40)) {
      error['email'] = this.errorService.max(40);
    } else if (!this.validatorService.email(data['email'])) {
      error['email'] = this.errorService.email;
    }

    if (!editar) {
      if (!this.validatorService.required(data['password'])) {
        error['password'] = this.errorService.required;
      }

      if (!this.validatorService.required(data['confirmar_password'])) {
        error['confirmar_password'] = this.errorService.required;
      }
    }

    if (!this.validatorService.required(data['curp'])) {
      error['curp'] = this.errorService.required;
    } else if (!this.validatorService.min(data['curp'], 18)) {
      error['curp'] = 'La CURP debe tener exactamente 18 caracteres';
    } else if (!this.validatorService.max(data['curp'], 18)) {
      error['curp'] = 'La CURP debe tener exactamente 18 caracteres';
    }

    if (!this.validatorService.required(data['rfc'])) {
      error['rfc'] = this.errorService.required;
    } else if (!this.validatorService.min(data['rfc'], 12)) {
      error['rfc'] = this.errorService.min(12);
    } else if (!this.validatorService.max(data['rfc'], 13)) {
      error['rfc'] = this.errorService.max(13);
    }

    if (!this.validatorService.required(data['telefono'])) {
      error['telefono'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['fecha_nacimiento'])) {
      error['fecha_nacimiento'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['edad'])) {
      error['edad'] = this.errorService.required;
    } else if (!this.validatorService.numeric(data['edad'])) {
      alert('El formato es solo números');
    } else if (data['edad'] < 1 || data['edad'] > 100) {
      error['edad'] = 'La edad debe estar entre 1 y 100';
    }

    if (!this.validatorService.required(data['ocupacion'])) {
      error['ocupacion'] = this.errorService.required;
    }

    return error;
  }

  public registrarAlumno(data: any): Observable<any> {
    return this.http.post<any>(
      `${environment.url_api}/alumno/`,
      data,
      httpOptions
    );
  }
}
