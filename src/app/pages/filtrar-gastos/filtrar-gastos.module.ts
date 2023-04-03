import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FiltrarGastosPageRoutingModule } from './filtrar-gastos-routing.module';

import { FiltrarGastosPage } from './filtrar-gastos.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FiltrarGastosPageRoutingModule,
    PipesModule
  ],
  declarations: [FiltrarGastosPage]
})
export class FiltrarGastosPageModule {}
