import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
 
 
import { PipesModule } from 'src/app/pipes/pipes.module';
import { RegistroAnticiposPage } from './registro-anticipos.page';
import { RegistroAnticiposPageRoutingModule } from './registro-anticipos-routing.module';
import { ComponentModule } from 'src/app/components/component.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroAnticiposPageRoutingModule,
    PipesModule,
    ComponentModule,
    NgxDatatableModule
  ],
  declarations: [RegistroAnticiposPage]
})
export class RegistroAnticiposPageModule {}
