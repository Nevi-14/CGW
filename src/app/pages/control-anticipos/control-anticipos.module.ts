import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
 
 
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ControlAnticiposPage } from './control-anticipos.page';
import { ControlAnticiposPageRoutingModule } from './control-anticipos-routing.module';
import { ComponentModule } from 'src/app/components/component.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlAnticiposPageRoutingModule,
    PipesModule,
    ComponentModule,
    NgxDatatableModule
  ],
  declarations: [ControlAnticiposPage]
})
export class ControlAnticiposPageModule {}
