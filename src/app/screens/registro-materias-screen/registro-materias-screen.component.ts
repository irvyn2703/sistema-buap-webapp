import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registro-materias-screen',
  templateUrl: './registro-materias-screen.component.html',
  styleUrls: ['./registro-materias-screen.component.scss'],
})
export class RegistroMateriasScreenComponent implements OnInit {
  public tipo: string = 'registro-materias';
  public title: string = '';

  constructor(public activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.title = 'Editar materia';
    } else {
      this.title = 'Registrar nueva materia';
    }
  }
}
