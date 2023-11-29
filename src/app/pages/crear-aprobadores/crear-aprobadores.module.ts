import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearAprobadoresPageRoutingModule } from './crear-aprobadores-routing.module';

import { CrearAprobadoresPage } from './crear-aprobadores.page';
import { ComponentModule } from 'src/app/components/component.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearAprobadoresPageRoutingModule,
    ComponentModule,
    PipesModule
  ],
  declarations: [CrearAprobadoresPage]
})
export class CrearAprobadoresPageModule {}
