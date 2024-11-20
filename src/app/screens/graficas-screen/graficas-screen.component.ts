import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GraficasService } from 'src/app/services/graficas.service';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss'],
})
export class GraficasScreenComponent implements OnInit {
  // Variables
  public total_user: number[] = [];
  public materiasPorPrograma: number[] = [];
  public materiasPorDia: number[] = [];
  public colores: string[] = ['#1E3A8A', '#3B82F6', '#60A5FA'];
  public fondo: string = '#2563EB';
  public borde: string = '#60A5FA';

  // Line Chart (Materias por día)
  lineChartData: any = null;
  lineChartOption = {
    responsive: true,
    plugins: {
      datalabels: {
        color: '#FFF',
        font: {
          size: 20,
        },
      },
    },
  };
  lineChartPlugins = [DatalabelsPlugin];

  // Bar Chart (Materias por programa)
  barChartData: any = null;
  barChartOption = {
    responsive: true,
    plugins: {
      datalabels: {
        color: '#FFF',
        font: {
          size: 20,
        },
      },
    },
  };
  barChartPlugins = [DatalabelsPlugin];

  // Pie Chart
  pieChartData: any = null;
  pieChartOption = {
    responsive: true,
    plugins: {
      datalabels: {
        color: '#FFF',
        font: {
          size: 20,
        },
      },
    },
  };
  pieChartPlugins = [DatalabelsPlugin];

  // Doughnut Chart
  doughnutChartData: any = null;
  doughnutChartOption = {
    responsive: true,
    plugins: {
      datalabels: {
        color: '#FFF',
        font: {
          size: 20,
        },
      },
    },
  };
  doughnutChartPlugins = [DatalabelsPlugin];

  constructor(private graficasServices: GraficasService) {}

  async ngOnInit(): Promise<void> {
    await this.cargarDatosYConfigurarGraficas();
  }

  private async cargarDatosYConfigurarGraficas(): Promise<void> {
    try {
      // Obtener datos de usuarios
      const usuariosResponse = await this.obtenerTotalUsers();
      let labelsPie = Object.keys(usuariosResponse);
      this.total_user = Object.values(usuariosResponse);

      // Configurar gráfica Doughnut
      this.doughnutChartData = {
        labels: labelsPie,
        datasets: [
          {
            data: this.total_user,
            label: 'Registro de usuarios',
            backgroundColor: this.colores,
          },
        ],
      };

      // Configurar gráfica Pie
      this.pieChartData = {
        labels: labelsPie,
        datasets: [
          {
            data: this.total_user,
            label: 'Registro de usuarios',
            backgroundColor: this.colores,
          },
        ],
      };

      const programasResponse = await this.obtenerMateriasPorPrograma();
      let labelsBar = Object.keys(programasResponse).map((programa) =>
        programa.match(/[A-Z]/g)?.join('')
      );
      this.materiasPorPrograma = Object.values(programasResponse);

      this.barChartData = {
        labels: labelsBar,
        datasets: [
          {
            data: this.materiasPorPrograma,
            label: 'Registro de materias por programa',
            backgroundColor: this.colores,
          },
        ],
      };

      // Obtener y configurar gráfica de materias por día (Line Chart)
      const diasResponse = await this.obtenerMateriasPorDia();
      let labelsLine = Object.keys(diasResponse);
      this.materiasPorDia = Object.values(diasResponse);

      this.lineChartData = {
        labels: labelsLine,
        datasets: [
          {
            data: this.materiasPorDia,
            label: 'Registro de materias por día',
            backgroundColor: this.fondo,
            borderColor: this.borde,
            fill: false,
          },
        ],
      };
    } catch (error) {
      alert('Error al cargar los datos para las gráficas.');
    }
  }

  private obtenerTotalUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.graficasServices.getTotalUsuarios().subscribe(
        (response) => resolve(response),
        (error) => reject(error)
      );
    });
  }

  private obtenerMateriasPorPrograma(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.graficasServices.getMateriasByPrograma().subscribe(
        (response) => resolve(response),
        (error) => reject(error)
      );
    });
  }

  private obtenerMateriasPorDia(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.graficasServices.getMateriasByDay().subscribe(
        (response) => resolve(response),
        (error) => reject(error)
      );
    });
  }
}
