import { Injectable } from '@angular/core';
import { FacadeService } from './facade.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GraficasService {
  constructor(public facadeService: FacadeService, public http: HttpClient) {}

  //Obtener el total de cada uno de los usuarios
  public getTotalUsuarios() {
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<any>(
      `${environment.url_api}/graficas-allUsersByType/`,
      {
        headers: headers,
      }
    );
  }

  public getMateriasByDay() {
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<any>(
      `${environment.url_api}/graficas-materiasByDay/`,
      {
        headers: headers,
      }
    );
  }

  public getMateriasByPrograma() {
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<any>(
      `${environment.url_api}/graficas-materiasByPrograma/`,
      {
        headers: headers,
      }
    );
  }
}
