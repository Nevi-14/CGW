import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FiltroPipe } from './filtro.pipe';
import { ColonesPipe } from './colones.pipe';
import { ValidacionFormularioPipe } from './validacion-formulario.pipe';



@NgModule({
  declarations: [
    FiltroPipe,
    ColonesPipe,
    ValidacionFormularioPipe
  
  ],
  exports:[
    FiltroPipe,
    DatePipe,
    ColonesPipe,
    ValidacionFormularioPipe
  ],
  imports: [
    CommonModule
  ]

})
export class PipesModule { }
