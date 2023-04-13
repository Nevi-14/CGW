import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlMatrizAccesoPageRoutingModule } from './control-matriz-acceso-routing.module';

import { ControlMatrizAccesoPage } from './control-matriz-acceso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlMatrizAccesoPageRoutingModule
  ],
  declarations: [ControlMatrizAccesoPage]
})
export class ControlMatrizAccesoPageModule {}
