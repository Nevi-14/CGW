import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExcedentePageRoutingModule } from './excedente-routing.module';

import { ExcedentePage } from './excedente.page';
import { ComponentModule } from 'src/app/components/component.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExcedentePageRoutingModule,
    ComponentModule,
    PipesModule
  ],
  declarations: [ExcedentePage]
})
export class ExcedentePageModule {}
