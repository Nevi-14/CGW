import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LineaGastosSinAnticipoPageRoutingModule } from './linea-gastos-sin-anticipo-routing.module';

import { LineaGastosSinAnticipoPage } from './linea-gastos-sin-anticipo.page';
import { ComponentModule } from 'src/app/components/component.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LineaGastosSinAnticipoPageRoutingModule,
    ComponentModule,
    NgxDatatableModule,
    PipesModule
  ],
  declarations: [LineaGastosSinAnticipoPage]
})
export class LineaGastosSinAnticipoPageModule {}
