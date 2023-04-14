import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlDepartamentosPageRoutingModule } from './control-departamentos-routing.module';

import { ControlDepartamentosPage } from './control-departamentos.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlDepartamentosPageRoutingModule,
    ComponentModule
  ],
  declarations: [ControlDepartamentosPage]
})
export class ControlDepartamentosPageModule {}
