import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlUsuariosPageRoutingModule } from './control-usuarios-routing.module';

import { ControlUsuariosPage } from './control-usuarios.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlUsuariosPageRoutingModule,
    ComponentModule
  ],
  declarations: [ControlUsuariosPage]
})
export class ControlUsuariosPageModule {}
