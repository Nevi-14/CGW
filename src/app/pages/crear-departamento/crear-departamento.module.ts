import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearDepartamentoPageRoutingModule } from './crear-departamento-routing.module';

import { CrearDepartamentoPage } from './crear-departamento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearDepartamentoPageRoutingModule
  ],
  declarations: [CrearDepartamentoPage]
})
export class CrearDepartamentoPageModule {}
