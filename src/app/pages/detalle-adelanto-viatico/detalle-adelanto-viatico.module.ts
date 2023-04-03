import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleAdelantoViaticoPageRoutingModule } from './detalle-adelanto-viatico-routing.module';

import { DetalleAdelantoViaticoPage } from './detalle-adelanto-viatico.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleAdelantoViaticoPageRoutingModule,
    PipesModule
  ],
  declarations: [DetalleAdelantoViaticoPage]
})
export class DetalleAdelantoViaticoPageModule {}
