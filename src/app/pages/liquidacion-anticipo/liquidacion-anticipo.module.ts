import { NgModule } from '@angular/core';
import { CommonModule, LowerCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiquidacionAnticipoPageRoutingModule } from './liquidacion-anticipo-routing.module';

import { LiquidacionAnticipoPage } from './liquidacion-anticipo.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiquidacionAnticipoPageRoutingModule,
    PipesModule,
    ComponentModule,
    LowerCasePipe
  ],
  declarations: [LiquidacionAnticipoPage]
})
export class LiquidacionAnticipoPageModule {}
