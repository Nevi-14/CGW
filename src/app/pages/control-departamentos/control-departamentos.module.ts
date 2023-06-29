import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlDepartamentosPageRoutingModule } from './control-departamentos-routing.module';

import { ControlDepartamentosPage } from './control-departamentos.page';
import { ComponentModule } from 'src/app/components/component.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlDepartamentosPageRoutingModule,
    ComponentModule,
    NgxDatatableModule
  ],
  declarations: [ControlDepartamentosPage]
})
export class ControlDepartamentosPageModule {}
