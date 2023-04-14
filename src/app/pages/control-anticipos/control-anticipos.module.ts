import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
 
 
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ControlAnticiposPage } from './control-anticipos.page';
import { ControlAnticiposPageRoutingModule } from './control-anticipos-routing.module';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlAnticiposPageRoutingModule,
    PipesModule,
    ComponentModule
  ],
  declarations: [ControlAnticiposPage]
})
export class ControlAnticiposPageModule {}
