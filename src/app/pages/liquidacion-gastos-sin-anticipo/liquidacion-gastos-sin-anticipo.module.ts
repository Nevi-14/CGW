import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiquidacionGastosSinAnticipoPageRoutingModule } from './liquidacion-gastos-sin-anticipo-routing.module';

import { LiquidacionGastosSinAnticipoPage } from './liquidacion-gastos-sin-anticipo.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiquidacionGastosSinAnticipoPageRoutingModule,
    PipesModule,
    ComponentModule
  ],
  declarations: [LiquidacionGastosSinAnticipoPage]
})
export class LiquidacionGastosSinAnticipoPageModule {}
