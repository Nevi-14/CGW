import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarRolePageRoutingModule } from './editar-role-routing.module';

import { EditarRolePage } from './editar-role.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarRolePageRoutingModule
  ],
  declarations: [EditarRolePage]
})
export class EditarRolePageModule {}
