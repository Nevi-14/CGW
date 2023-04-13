import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearMatrizAccesoPageRoutingModule } from './crear-matriz-acceso-routing.module';

import { CrearMatrizAccesoPage } from './crear-matriz-acceso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearMatrizAccesoPageRoutingModule
  ],
  declarations: [CrearMatrizAccesoPage]
})
export class CrearMatrizAccesoPageModule {}
