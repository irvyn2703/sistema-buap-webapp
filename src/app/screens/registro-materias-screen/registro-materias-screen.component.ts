import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MateriasService } from 'src/app/services/materias.service';

@Component({
  selector: 'app-registro-materias-screen',
  templateUrl: './registro-materias-screen.component.html',
  styleUrls: ['./registro-materias-screen.component.scss'],
})
export class RegistroMateriasScreenComponent implements OnInit {
  public tipo: string = 'registro-materias';
  public title: string = '';
  public materia: any = [];
  public nrc: number = 0;

  constructor(
    public activatedRoute: ActivatedRoute,
    public materiaService: MateriasService
  ) {}

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params['nrc'] != undefined) {
      this.nrc = this.activatedRoute.snapshot.params['nrc'];
      this.title = 'Editar materia';
    } else {
      this.title = 'Registrar nueva materia';
    }
  }
}
