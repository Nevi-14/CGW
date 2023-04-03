import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiquidacionViaticosPageRoutingModule } from './liquidacion-viaticos-routing.module';

import { LiquidacionViaticosPage } from './liquidacion-viaticos.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiquidacionViaticosPageRoutingModule,
    PipesModule
  ],
  declarations: [LiquidacionViaticosPage]
})
export class LiquidacionViaticosPageModule {}
