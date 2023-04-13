import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearRolePageRoutingModule } from './crear-role-routing.module';

import { CrearRolePage } from './crear-role.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearRolePageRoutingModule
  ],
  declarations: [CrearRolePage]
})
export class CrearRolePageModule {}
