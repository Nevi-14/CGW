import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiquidacionAnticipoPageRoutingModule } from './liquidacion-anticipo-routing.module';

import { LiquidacionAnticipoPage } from './liquidacion-anticipo.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiquidacionAnticipoPageRoutingModule,
    PipesModule
  ],
  declarations: [LiquidacionAnticipoPage]
})
export class LiquidacionAnticipoPageModule {}
