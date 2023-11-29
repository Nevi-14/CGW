import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FiltroAnticiposPageRoutingModule } from './filtro-anticipos-routing.module';

import { FiltroAnticiposPage } from './filtro-anticipos.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FiltroAnticiposPageRoutingModule,
    ComponentModule
  ],
  declarations: [FiltroAnticiposPage]
})
export class FiltroAnticiposPageModule {}
