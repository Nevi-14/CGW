import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MapaComponent } from './mapa/mapa.component';
import { PiePaginaComponent } from './pie-pagina/pie-pagina.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { NgChartsModule } from 'ng2-charts';



@NgModule({
  declarations: [EncabezadoComponent,MapaComponent,PiePaginaComponent,PieChartComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    NgChartsModule
  ],
  exports: [
    EncabezadoComponent,MapaComponent,PiePaginaComponent,PieChartComponent
  ]
})
export class ComponentModule { }

