import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GastosSinAnticipoPageRoutingModule } from './gastos-sin-anticipo-routing.module';

import { GastosSinAnticipoPage } from './gastos-sin-anticipo.page';
import { ComponentModule } from 'src/app/components/component.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GastosSinAnticipoPageRoutingModule,
    ComponentModule,
    PipesModule,
    NgxDatatableModule
  ],
  declarations: [GastosSinAnticipoPage]
})
export class GastosSinAnticipoPageModule {}
