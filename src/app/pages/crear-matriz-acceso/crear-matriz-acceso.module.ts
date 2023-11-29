import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearMatrizAccesoPageRoutingModule } from './crear-matriz-acceso-routing.module';

import { CrearMatrizAccesoPage } from './crear-matriz-acceso.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearMatrizAccesoPageRoutingModule,
    ComponentModule,
    ReactiveFormsModule
  ],
  declarations: [CrearMatrizAccesoPage]
})
export class CrearMatrizAccesoPageModule {}
