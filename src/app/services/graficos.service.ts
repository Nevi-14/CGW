import { Injectable } from '@angular/core';
import { TiposGastos } from '../models/tiposGastos';
import { Chart } from 'chart.js';
interface gastos {
  id: number,
  imagen: string,
  tipo: string,
  descripcion: string,
  totalColones:number,
  totalDolares:number,
  gastos: any[] 
}
@Injectable({
  providedIn: 'root'
})


export class GraficosService {
  barChart: any;
  doughnutChart: any;
  lineChart: any;
 accionGasto:boolean = false;
  gastos: gastos[] = [];
  tiposGastos: TiposGastos[] = [];
anticipoLiquidado:boolean = false;
  fecha: Date = new Date();
  ano = this.fecha.getFullYear();
  mes = this.fecha.getMonth();
  fechaInicioS = this.getMonday(this.fecha);
  fechaFinS = this.obtenerFechaCorte();
  fechaInicioSemana = this.getMonday(this.fecha).toISOString();
  fechaFinSemana = this.obtenerFechaCorte().toISOString();
  fechaInicioMes = new Date(this.ano, this.mes, 1).toISOString();
  fechaFinMes = new Date(this.ano, this.mes + 1, 0).toISOString();
  gastoSinAnticipo: boolean = false;
  totalColones: number = 0;
  totalDolares: number = 0;
  labels = ['Alimentacion','Representacion','Transporte','Hospedaje','Otros'];
  data = [1,1,1,1,1];
  constructor() { }

  async  destruirDashboard(){
 
    if(this.barChart instanceof Chart)
    {
      this.barChart.destroy();
    }
     
    if(this.doughnutChart instanceof Chart)
    {
      this.doughnutChart.destroy();
    }
     
    
    if(this.lineChart instanceof Chart)
    {
      this.lineChart.destroy();
    }
   }

 async   cargarGRaficos(){
  await this.destruirDashboard();
    this.barChartMethod();
    this.doughnutChartMethod();
    this.lineChartMethod();
     
  }

  getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }
  
  obtenerFechaCorte() {
    let currentDate = this.fechaInicioS;
    let date = currentDate.getDay();
    let daysToSunday = 7 - date;
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + daysToSunday);
  }

   barChartMethod() {
    let barCanvas: any = document.getElementsByClassName('barCanvas');
    console.log('barCanvas',barCanvas)
    this.barChart = new Chart(barCanvas, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          label: '# de gastos',
          data: this.data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {

      }
    });
  }

  doughnutChartMethod() {
    let doughnutCanvas: any = document.getElementById('doughnutCanvas');
    console.log('doughnutCanvas',doughnutCanvas)
    this.doughnutChart = new Chart(doughnutCanvas, {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [{
          label: '# de gastos',
          data: this.data,
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)'
          ],
          hoverBackgroundColor: [
            '#FFCE56',
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#FF6384'
          ]
        }]
      }
    });
  }

  lineChartMethod() {
    let lineCanvas: any = document.getElementById('lineCanvas');
    console.log('lineCanvas',lineCanvas)
    this.lineChart = new Chart(lineCanvas, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Gastos Mensuales',
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.data,
            spanGaps: false,
          }
        ]
      }
    });
  }
}
