import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FiltroSolicitudesPageRoutingModule } from './filtro-solicitudes-routing.module';

import { FiltroSolicitudesPage } from './filtro-solicitudes.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FiltroSolicitudesPageRoutingModule,
    PipesModule,
    ComponentModule
  ],
  declarations: [FiltroSolicitudesPage]
})
export class FiltroSolicitudesPageModule {}
