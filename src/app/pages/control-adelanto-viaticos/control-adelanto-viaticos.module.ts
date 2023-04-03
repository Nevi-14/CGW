import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlAdelantoViaticosPageRoutingModule } from './control-adelanto-viaticos-routing.module';

import { ControlAdelantoViaticosPage } from './control-adelanto-viaticos.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlAdelantoViaticosPageRoutingModule,
    PipesModule
  ],
  declarations: [ControlAdelantoViaticosPage]
})
export class ControlAdelantoViaticosPageModule {}
