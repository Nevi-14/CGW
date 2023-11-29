import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AprobadoresPageRoutingModule } from './aprobadores-routing.module';

import { AprobadoresPage } from './aprobadores.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AprobadoresPageRoutingModule,
    ComponentModule
  ],
  declarations: [AprobadoresPage]
})
export class AprobadoresPageModule {}
