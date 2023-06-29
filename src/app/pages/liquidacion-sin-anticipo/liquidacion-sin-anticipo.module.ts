import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiquidacionSinAnticipoPageRoutingModule } from './liquidacion-sin-anticipo-routing.module';

import { LiquidacionSinAnticipoPage } from './liquidacion-sin-anticipo.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiquidacionSinAnticipoPageRoutingModule,
    PipesModule,
    ComponentModule
  ],
  declarations: [LiquidacionSinAnticipoPage]
})
export class LiquidacionSinAnticipoPageModule {}
