import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-visor-archivos',
  templateUrl: './visor-archivos.page.html',
  styleUrls: ['./visor-archivos.page.scss'],
})
export class VisorArchivosPage implements OnInit {
@Input() file: string;
url = null
  constructor(
   public modalCtrl: ModalController 
  ) { }

  ngOnInit() {
    this.url = 'https://sde1.sderp.site/api-coris-control-viaticos/api/mostrar-archivo?file='+this.file;
    console.log(this.url)
  }
  cerrarModal(){
   this.modalCtrl.dismiss();
  }
}
