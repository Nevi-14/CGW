import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CentroCostosPageRoutingModule } from './centro-costos-routing.module';

import { CentroCostosPage } from './centro-costos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CentroCostosPageRoutingModule
  ],
  declarations: [CentroCostosPage]
})
export class CentroCostosPageModule {}
