import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlRolesPageRoutingModule } from './control-roles-routing.module';

import { ControlRolesPage } from './control-roles.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlRolesPageRoutingModule,
    ComponentModule
  ],
  declarations: [ControlRolesPage]
})
export class ControlRolesPageModule {}
