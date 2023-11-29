import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ControlMatrizAccesoPageRoutingModule } from './control-matriz-acceso-routing.module';
import { ControlMatrizAccesoPage } from './control-matriz-acceso.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlMatrizAccesoPageRoutingModule,
    ComponentModule
  ],
  declarations: [ControlMatrizAccesoPage]
})
export class ControlMatrizAccesoPageModule {}
