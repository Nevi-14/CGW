import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FiltroGastosSinAnticipoPageRoutingModule } from './filtro-gastos-sin-anticipo-routing.module';

import { FiltroGastosSinAnticipoPage } from './filtro-gastos-sin-anticipo.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FiltroGastosSinAnticipoPageRoutingModule,
    ComponentModule
  ],
  declarations: [FiltroGastosSinAnticipoPage]
})
export class FiltroGastosSinAnticipoPageModule {}
