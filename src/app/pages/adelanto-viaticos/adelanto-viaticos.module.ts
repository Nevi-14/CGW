import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdelantoViaticosPageRoutingModule } from './adelanto-viaticos-routing.module';

import { AdelantoViaticosPage } from './adelanto-viaticos.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdelantoViaticosPageRoutingModule,
    PipesModule
  ],
  declarations: [AdelantoViaticosPage]
})
export class AdelantoViaticosPageModule {}
