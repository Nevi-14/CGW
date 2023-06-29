import { Component, OnInit, ViewChild } from '@angular/core';
import { GastoSinAnticipo } from 'src/app/models/gastoSinAnticipo';
import { AlertasService } from 'src/app/services/alertas.service';
import { GastosSinAnticipoService } from 'src/app/services/gastos-sin-anticipo.service';
import { LiquidacionSinAnticipoPage } from '../liquidacion-sin-anticipo/liquidacion-sin-anticipo.page';
import { ModalController } from '@ionic/angular';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-gastos-sin-anticipo',
  templateUrl: './gastos-sin-anticipo.page.html',
  styleUrls: ['./gastos-sin-anticipo.page.scss'],
})
export class GastosSinAnticipoPage implements OnInit {
  gastosSinAnticipo:GastoSinAnticipo[]=[];
  isOpen:boolean = false;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  public columns: any;
  multi:any ='multi';
  public rows: any[];
  temp = [];
  constructor(
public alertasService:AlertasService,
public gastosSinAnticipoService:GastosSinAnticipoService,
public modalCtrl:ModalController

  ) { this.cargarDatos()}
  cargarDatos(){

    this.columns = [
      { id: "referencia", label: "Referencia", size: 2},
      { id: "usuario", label: "Usuario", size: 2 },
      { id: "fechA_INICIAL", label: "Fecha Inicial", size: 2 },
      { id: "monto", label: "Monto", size: 2 },
      { id: "descripcion", label: "Descripcion", size: 2 },
      { id: "opciones", label: "Opciones", size: 2 }
  ];
  this.gastosSinAnticipoService.syncGetGastosSinAnticipoToPromise()
      .then((res) => {
        console.log(res)
        this.temp = [...res];

      // push our inital complete list
      this.rows = res;
      });
  }
editarElemento(row) {
  console.log(row,'editarElemento');
  let i = this.rows.findIndex( e => e.id == row.id);
  if(i >= 0){
    console.log('this.rows[i]',this.rows[i])
  }
}
borrarElemento(row) {
  let i = this.rows.findIndex( e => e.id == row.id);
  if(i >= 0){
    console.log('this.rows[i]',this.rows[i])
  }

  console.log(row,'borrarElemento');
}


 updateFilter(event) {
  const val = event.target.value.toLowerCase();

  // filter our data
  const temp = this.temp.filter(function (d) {
  //d.nombre, d.descripcion, etc..
  console.log('d',d)
    return d.usuario.toLowerCase().indexOf(val) !== -1 || !val;
  });

  // update the rows
  this.rows = temp;
  // Whenever the filter changes, always go back to the first page
  this.table.offset = 0;

}

  ngOnInit() {
 
  }
  onSearchChange($event){
    
  }

  async liquidacionAnticipo() {
 
    this.isOpen = true;

    const modal = await this.modalCtrl.create({
      component: LiquidacionSinAnticipoPage,
      cssClass: 'alert-modal-large',
      mode:'ios'
    });

    if (this.isOpen) {

      modal.present();
      const { data } = await modal.onWillDismiss();
      this.isOpen = false;
      if (data != undefined) {
   

      }

    }
  }
}
