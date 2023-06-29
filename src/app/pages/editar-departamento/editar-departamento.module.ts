import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarDepartamentoPageRoutingModule } from './editar-departamento-routing.module';

import { EditarDepartamentoPage } from './editar-departamento.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarDepartamentoPageRoutingModule,
    ComponentModule
  ],
  declarations: [EditarDepartamentoPage]
})
export class EditarDepartamentoPageModule {}
