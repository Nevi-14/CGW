import { Component, OnInit, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartData, ChartEvent, ChartType, ChartConfiguration } from 'chart.js';
import { BaseChartDirective, ThemeService } from 'ng2-charts'; // https://www.npmjs.com/package/ng2-charts + https://valor-software.com/ng2-charts/#PieChart  + https://www.npmjs.com/package/chartjs-plugin-datalabels
import { Platform } from '@ionic/angular';

import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service';
import { GastosService } from 'src/app/services/gastos.service';
import { AdelantoViaticosService } from 'src/app/services/adelanto-viaticos.service';
import { vistaGastos } from 'src/app/models/gastosView';
import { TiposGastosService } from 'src/app/services/tipos-gastos.service';
import { LineaGasto, LineaGastoView } from 'src/app/models/gastos';
interface gastosV {
  id : number,
  total:number,
  lineas:number,
  descripcion:string,
  gastos:LineaGastoView[]
}
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  width: number;
  chartHeight = '0px';
gastos:gastosV[]=[];

  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      datalabels: {
        formatter: (value, ctx) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
      },
    }
  };
  pieChartData: ChartData<'pie', number[], string | string[]> =  null;
  
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [DatalabelsPlugin];

  constructor(
    public plt: Platform,
    public alertService: AlertasService,
    public cd: ChangeDetectorRef,
    public router: Router,
    public adelantosService:AdelantoViaticosService,
    public gastosService:GastosService,
    public tiposGastosService:TiposGastosService


  ) { }

  ngOnInit() {
    let labels =  [];
    let data = [];



    this.gastosService.syncGetGastosAnticipoToPtomise(this.adelantosService.adelantoViatico.id).then(async (resp) =>{

 console.log('vista', resp)
      resp.forEach( async (g, index) =>{
        let gastos = await this.tiposGastosService.getgastosToPromise();

        console.log('gastos', gastos)
        console.log('g', gastos)
        
       let indexT =  gastos.findIndex( e => e.descripcion == g.tipO_GASTO)
        let gasto = {
          id :  indexT >=0 ? gastos[indexT].id : null,
          total:g.monto,
          lineas:1,
          descripcion: indexT >=0 ? gastos[indexT].descripcion : null,
          gastos:[g]
        }
        let i = this.gastos.findIndex(e => e.descripcion == g.tipO_GASTO);
        console.log('i', i)
        console.log('this.gastos', this.gastos)
        if(i < 0){

          labels.push( indexT >=0 ? gastos[indexT].descripcion : null)

          this.gastos.push(gasto);
        }else if (i >=0){
          this.gastos[i].lineas += 1;
          this.gastos[i].total += g.monto;
          this.gastos[i].gastos.push(g);
        }
        

        if(index == resp.length -1){
          this.gastos.forEach( (t, index2) =>{
            data.push(t.lineas);

            if(index2 == this.gastos.length -1){
              console.log('module dashboard')

this.pieChartData = {
  labels: labels,
  datasets: [{
    data: data
  }]
}
console.log('module dashboard 2', this.pieChartData, this.chart, 'chart')
this.toggleMenu();
            }
          })
          
          console.log('gastos', this.gastos)
          console.log('data', data)
        }
      })
     
    })


  }
  ionViewWillEnter() {
    this.pieChartData = null;
    this.alertService.presentaLoading('Cargando datos...')
    this.width = this.plt.width();
    this.toggleMenu()
    let labels = ['Web Sales', 'Store Sales', 'Mail Sales'];
    let data = [300, 500, 100];


    setTimeout(() => {

      this.pieChartData = {
        labels: labels,
        datasets: [{
          data: data
        }]
      }
      this.alertService.loadingDissmiss();

    }, 1000)

  }

  toggleMenu() {

    if (this.width > 1400) {

      this.chartHeight = '600px';

    } else if (this.width >= 768 && this.width <= 1366) {

      this.chartHeight = '400px';

    } else {


      this.chartHeight = '100%';


    }


    this.cd.detectChanges();
    this.cd.markForCheck();


  }



  // CHECKS SCREEN RESIZE LIVE

  @HostListener('window:resize', ['$event'])

  private onResize(event) {

    this.width = event.target.innerWidth;
    this.toggleMenu();

  }


}
