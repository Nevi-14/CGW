import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarMatrizAccesoPageRoutingModule } from './editar-matriz-acceso-routing.module';

import { EditarMatrizAccesoPage } from './editar-matriz-acceso.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarMatrizAccesoPageRoutingModule,
    ComponentModule,
    ReactiveFormsModule
  ],
  declarations: [EditarMatrizAccesoPage]
})
export class EditarMatrizAccesoPageModule {}
