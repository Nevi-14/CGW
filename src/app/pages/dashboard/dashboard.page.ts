import { Component, OnInit, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartData, ChartEvent, ChartType, ChartConfiguration } from 'chart.js';
import {BaseChartDirective, ThemeService } from 'ng2-charts'; // https://www.npmjs.com/package/ng2-charts + https://valor-software.com/ng2-charts/#PieChart  + https://www.npmjs.com/package/chartjs-plugin-datalabels
import { Platform } from '@ionic/angular';
import { AlertasService } from '../../services/alertas.service';
import { ConfiguracionesService } from '../../services/configuraciones';
import { Router } from '@angular/router';
import { GastosService } from '../../services/gastos.service';
import { gastos } from '../../models/gastos';
type Theme = 'light-theme' | 'dark-theme';
interface modeloGastosDashboard {
  gasto:string,
  id:string
  total:number,
  gastos:gastos[]
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  width:number;
  chartHeight  = '0px';
gastos:modeloGastosDashboard[]=[];
today:Date = new Date();
y = this.today.getFullYear();
m = this.today.getMonth();
value1 = new Date(this.y, this.m , 1).toISOString();
value2 = new Date(this.y, this.m+1 , 0).toISOString();
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
   pieChartData: ChartData<'pie', number[], string | string[]> = null;
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [ DatalabelsPlugin ];

  constructor(
    public plt:Platform,
    public alertasSerivice:AlertasService,
    public cd:ChangeDetectorRef,
    public configSettings:ConfiguracionesService,
    public router:Router,
    public gastosService: GastosService
    

  ) { }
 
  ngOnInit() {
    this.width = this.plt.width();
    this.toggleMenu()
    this.alertasSerivice.presentaLoading('Cargando Datos...')
    this.gastosService.getGastosToPromise("",this.value1, this.value2).then(resp =>{
      console.log('gastos resp', resp)
      this.alertasSerivice.loadingDissmiss();
      for(let i =0; i < resp.length ; i++){

        let g = this.gastos.findIndex(gasto => gasto.id == resp[i].tipo_Gasto)
            if(g >=0){
              this.gastos[g].gastos.push(resp[i])
              this.gastos[g].total = this.gastos[g].gastos.length;
            }else{

              this.gastos.push({
                gasto:resp[i].justificacion,
                id:resp[i].tipo_Gasto,
                total:1,
                gastos:[resp[i]]
              })
            }
        if(i == resp.length -1){
  
console.log('gastos array', this.gastos)

let labels = [];
let data = [];

for(let y =0; y < this.gastos.length; y++){

  labels.push(this.gastos[y].gasto)
  data.push(this.gastos[y].gastos.length)
  if(y == this.gastos.length -1){
    this.gastos.sort((a,b) => b.total - a.total)

    this.pieChartData =  {
      labels: labels,
      datasets: [ {
        data: data
      } ]
    }

  }
}


        }
      }





    }, error =>{
      this.alertasSerivice.loadingDissmiss();

    })



    
   
  }
 
  toggleMenu(){
    if(this.width > 1400){
      this.chartHeight = '600px';
  
 
     } else if(this.width >= 768 && this.width <= 1366){
      this.chartHeight = '400px';
  
   
    }else{
    
       // this.menuCtrl.toggle('myMenu');
       this.chartHeight = '100%';

  
    }
  console.log(this.chart, 'ch')

    this.cd.detectChanges();
    this.cd.markForCheck();
   // this.router.navigateByUrl('/inicio/dashboard1', {replaceUrl:true})
    
  }



// CHECKS SCREEN RESIZE LIVE

@HostListener('window:resize',['$event'])

private onResize(event){

this.width = event.target.innerWidth;
this.toggleMenu();

}


}
