import { Component } from '@angular/core';
import { ConfiguracionesService } from './services/configuraciones';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
public configuracionesService: ConfiguracionesService

  ) {}

  ngOnInit(){
 
this.configuracionesService.getURL();
 
  
   }
}
