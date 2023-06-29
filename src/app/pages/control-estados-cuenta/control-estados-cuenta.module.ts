import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlEstadosCuentaPageRoutingModule } from './control-estados-cuenta-routing.module';

import { ControlEstadosCuentaPage } from './control-estados-cuenta.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentModule } from 'src/app/components/component.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlEstadosCuentaPageRoutingModule,
    PipesModule,
    ComponentModule,
    NgxDatatableModule
  ],
  declarations: [ControlEstadosCuentaPage]
})
export class ControlEstadosCuentaPageModule {}
