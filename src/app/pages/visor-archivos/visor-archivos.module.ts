import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisorArchivosPageRoutingModule } from './visor-archivos-routing.module';

import { VisorArchivosPage } from './visor-archivos.page';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisorArchivosPageRoutingModule,
    NgxDocViewerModule
  ],
  declarations: [VisorArchivosPage]
})
export class VisorArchivosPageModule {}
