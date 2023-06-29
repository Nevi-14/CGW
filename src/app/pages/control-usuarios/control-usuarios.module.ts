import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlUsuariosPageRoutingModule } from './control-usuarios-routing.module';

import { ControlUsuariosPage } from './control-usuarios.page';
import { ComponentModule } from 'src/app/components/component.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlUsuariosPageRoutingModule,
    ComponentModule,
    NgxDatatableModule
  ],
  declarations: [ControlUsuariosPage]
})
export class ControlUsuariosPageModule {}
