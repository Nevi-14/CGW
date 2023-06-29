import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearDepartamentoPageRoutingModule } from './crear-departamento-routing.module';

import { CrearDepartamentoPage } from './crear-departamento.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearDepartamentoPageRoutingModule,
    ComponentModule
  ],
  declarations: [CrearDepartamentoPage]
})
export class CrearDepartamentoPageModule {}
