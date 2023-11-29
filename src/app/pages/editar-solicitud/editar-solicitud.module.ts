import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarSolicitudPageRoutingModule } from './editar-solicitud-routing.module';

import { EditarSolicitudPage } from './editar-solicitud.page';
import { ComponentModule } from 'src/app/components/component.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarSolicitudPageRoutingModule,
    ComponentModule,
    PipesModule
  ],
  declarations: [EditarSolicitudPage]
})
export class EditarSolicitudPageModule {}
