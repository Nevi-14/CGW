import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MapaComponent } from './mapa/mapa.component';
import { PiePaginaComponent } from './pie-pagina/pie-pagina.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { RobotMessageComponent } from './robot-message/robot-message.component';
import { InputComponent } from './input/input.component';
import { ButtonComponent } from './button/button.component';
import { IconButtonComponent } from './icon-button/icon-button.component';
import { SelectComponent } from './select/select.component';



@NgModule({
  declarations: [
    EncabezadoComponent,
    MapaComponent,
    PiePaginaComponent,
    PieChartComponent,
    RobotMessageComponent,
    InputComponent,
    ButtonComponent,
    IconButtonComponent,
    SelectComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    NgChartsModule
  ],
  exports: [
    EncabezadoComponent,
    MapaComponent,
    PiePaginaComponent,
    PieChartComponent,
    RobotMessageComponent,
    InputComponent,
    ButtonComponent,
    IconButtonComponent,
    SelectComponent
  ]
})
export class ComponentModule { }

