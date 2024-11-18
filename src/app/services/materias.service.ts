import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { FacadeService } from './facade.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class MateriasService {
  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) {}

  public esquemaMateria() {
    return {
      nrc: '', // Número de referencia del curso
      nombre: '', // Nombre de la materia
      seccion: '', // Número de sección
      dias_json: [], // Lista de días seleccionados
      hora_inicio: '', // Hora de inicio
      hora_fin: '', // Hora de fin
      salon: '', // Identificador del salón
      programa: '', // Programa educativo asociado
      maestro: '', // ID del profesor asignado
      creditos: '', // Número de créditos del curso
    };
  }

  // Validación para el formulario de materia
  public validarMateria(data: any) {
    console.log('Validando materia...', data);

    let error: any = {};

    // Validación para NRC
    if (!this.validatorService.required(data['nrc'])) {
      error['nrc'] = this.errorService.required;
    } else if (!this.validatorService.min(data['nrc'], 5)) {
      error['nrc'] = this.errorService.min(5);
    } else if (!this.validatorService.max(data['nrc'], 6)) {
      error['nrc'] = this.errorService.max(6);
    }

    // Validación para nombre de la materia
    if (!this.validatorService.required(data['nombre'])) {
      error['nombre'] = this.errorService.required;
    }

    // Validación para sección
    if (!this.validatorService.required(data['seccion'])) {
      error['seccion'] = this.errorService.required;
    } else if (!this.validatorService.max(data['seccion'], 3)) {
      error['seccion'] = this.errorService.max(3);
    }

    // Validación para días seleccionados (`dias_json`)
    if (!data['dias_json'] || data['dias_json'].length === 0) {
      error['dias_json'] = 'Debes seleccionar al menos un día de la semana.';
    }

    // Validación para horario
    if (!this.validatorService.required(data['hora_inicio'])) {
      error['hora'] = this.errorService.required;
    }
    if (!this.validatorService.required(data['hora_fin'])) {
      error['hora'] = this.errorService.required;
    } else if (data['hora_inicio'] > data['hora_fin']) {
      error['hora'] = 'La hora de inicio debe ser menor que la hora de fin.';
    } else if (data['hora_inicio'] == data['hora_fin']) {
      error['hora'] = 'La hora de inicio y hora de fin no pueden ser iguales.';
    }

    // Validación para salón
    if (!this.validatorService.required(data['salon'])) {
      error['salon'] = this.errorService.required;
    }

    // Validación para programa educativo
    if (!this.validatorService.required(data['programa'])) {
      error['programa'] = this.errorService.required;
    }

    // Validación para profesor asignado
    if (!this.validatorService.required(data['maestro'])) {
      error['maestro'] = this.errorService.required;
    }

    // Validación para créditos
    if (!this.validatorService.required(data['creditos'])) {
      error['creditos'] = this.errorService.required;
    } else if (!this.validatorService.max(data['creditos'], 2)) {
      error['creditos'] = this.errorService.max(2);
    }

    // Retorna el objeto de errores
    return error;
  }

  public registrarMateria(data: any): Observable<any> {
    return this.http.post<any>(
      `${environment.url_api}/materia/`,
      data,
      httpOptions
    );
  }
}
