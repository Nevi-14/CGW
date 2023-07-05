import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LineaGastosPageRoutingModule } from './linea-gastos-routing.module';

import { LineaGastosPage } from './linea-gastos.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentModule } from 'src/app/components/component.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LineaGastosPageRoutingModule,
    PipesModule,
    ComponentModule,
    NgxDatatableModule
  ],
  declarations: [LineaGastosPage]
})
export class LineaGastosPageModule {}
