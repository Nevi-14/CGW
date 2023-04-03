import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearAdelantoViaticosPageRoutingModule } from './crear-adelanto-viaticos-routing.module';

import { CrearAdelantoViaticosPage } from './crear-adelanto-viaticos.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearAdelantoViaticosPageRoutingModule,
    PipesModule
  ],
  declarations: [CrearAdelantoViaticosPage]
})
export class CrearAdelantoViaticosPageModule {}
