import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { GastoSinAnticipo } from 'src/app/models/gastoSinAnticipo';
import { GastosSinAnticipoService } from 'src/app/services/gastos-sin-anticipo.service';
import { EditarGastoSinAnticipoPage } from '../editar-gasto-sin-anticipo/editar-gasto-sin-anticipo.page';
interface usuariosGastos {
  usuario: string,
  pendientes: number,
  utilizado: number,
  gastos: GastoSinAnticipo[]
}
@Component({
  selector: 'app-linea-gastos-sin-anticipo',
  templateUrl: './linea-gastos-sin-anticipo.page.html',
  styleUrls: ['./linea-gastos-sin-anticipo.page.scss'],
})
export class LineaGastosSinAnticipoPage implements OnInit {
  @Input() gastosSinAnticipo: usuariosGastos;

  gastos: GastoSinAnticipo[] = []
  observaciones = null;
  isOpen: boolean = false;
  sobrante: any = null;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  public columns: any;
  public rows: any[] = [];
  temp = [];
  url = "https://sde1.sderp.site/api-coris-control-viaticos/api/descargar-archivo?id=";
  constructor(
    public gastosSinanticipoService: GastosSinAnticipoService,
    public modalCtrl:ModalController
  ) {   }

  ngOnInit() {
    this.cargarDatos() 
  }
  cargarDatos() {
     
    this.columns = [
      { id: "referencia", label: "Factura", size: 2 },
      { id: "descripcion", label: "Descripcion", size: 2 },
      { id: "monto", label: "Monto", size: 2 },
      { id: "estatus", label: "Estatus", size: 2 },
      { id: "opciones", label: "Opciones", size: 2 }
    ];
    console.log('usuario',this.gastosSinAnticipo)
  if(this.gastosSinAnticipo){
    this.gastos = this.gastosSinAnticipo.gastos;
    this.temp = [...this.gastos];

    // push our inital complete list
    this.rows = this.gastos;
  }
     
  



  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }
  editarElemento(row) {
    console.log(row,'editarElemento');
    let i = this.rows.findIndex( e => e.id == row.id);
    if(i >= 0){
      this.gastoDetalle(this.rows[i])
    }
  }

  async gastoDetalle(nuevoGasto) {
    const modal = await this.modalCtrl.create({
      component: EditarGastoSinAnticipoPage,
      cssClass: 'alert-modal',
      mode: 'ios',
      componentProps:{
        nuevoGasto: nuevoGasto
      }
    })

    modal.present();
    const { data } = await modal.onWillDismiss();
    if (data != undefined) {
 
    }
    this.cargarDatos();
  }
   
}
