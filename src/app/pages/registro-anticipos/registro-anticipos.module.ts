import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
 
 
import { PipesModule } from 'src/app/pipes/pipes.module';
import { RegistroAnticiposPage } from './registro-anticipos.page';
import { RegistroAnticiposPageRoutingModule } from './registro-anticipos-routing.module';
 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroAnticiposPageRoutingModule,
    PipesModule
  ],
  declarations: [RegistroAnticiposPage]
})
export class RegistroAnticiposPageModule {}
