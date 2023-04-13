import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

 
import { NgChartsModule } from 'ng2-charts';
 
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ControlGastosdPage } from './control-gastos.page';
import { ControlGastosPageRoutingModule } from './control-gastos-routing.module';
// installing dashboard
// https://www.udemy.com/course/angular-fernando-herrera/learn/lecture/24268852#overview
//  https://valor-software.com/ng2-charts/


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlGastosPageRoutingModule,
    NgChartsModule,
    PipesModule
  ],
  declarations: [ControlGastosdPage],
 
})
export class ControlGastosPageModule {}
