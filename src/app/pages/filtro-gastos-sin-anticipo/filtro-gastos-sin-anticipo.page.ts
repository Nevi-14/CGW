import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import { CalendarioPopoverPage } from '../calendario-popover/calendario-popover.page';
import { format } from 'date-fns';
import { CompaniasService } from 'src/app/services/companias.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-filtro-gastos-sin-anticipo',
  templateUrl: './filtro-gastos-sin-anticipo.page.html',
  styleUrls: ['./filtro-gastos-sin-anticipo.page.scss'],
})
export class FiltroGastosSinAnticipoPage implements OnInit {
  formatoFecha = new Date(format(new Date(), 'yyy/MM/dd')).toISOString();
  companias:any[]=[]
  moneda = '₡';
  estatus = 'todos';
  compania = null;
  valor1 =  new Date();
  valor2 =  new Date();
  monedas = [
{    id:'₡',
    valor:'₡'},
    {    id:'$',
    valor:'$'}
  ]
  estatuses = [
    {
     id: 'P',
     valor : 'Pendiente'
    },
    {
      id: 'RA',
      valor : 'Requiere Aprobación'
     },
    {
      id: 'A',
      valor : 'Aprobado'
     },
     {
      id: 'R',
      valor : 'Rechazado'
     },
     {
      id: 'todos',
      valor : 'Todos'
     }
  ]
  constructor(
    public modalCtrl: ModalController,
    public alertasService: AlertasService,   
    public popOverCtrl: PopoverController,
    public companiasService:CompaniasService
  ) { }

  ngOnInit() {
    this.companiasService.syncGetCompaniasToPromise().then(companias =>{
      companias.forEach(compania =>{

        let data = {
          id: compania.nombre,
          valor:compania.nombre
        }
        this.companias.push(data)
      })
    })
  }
  async fecha(identificador: string) {

    let nuevaFecha = null;
    switch (identificador) {
      case 'valor1':
       nuevaFecha = this.valor1.toISOString();

        break;
      case 'valor2':
        nuevaFecha = this.valor2.toISOString();;
        break;
    }
    const popover = await this.popOverCtrl.create({
      component: CalendarioPopoverPage,
      cssClass: 'my-custom-class',
      translucent: true,
      componentProps: {
        fecha: nuevaFecha
      }
    })

    await popover.present();
    const { data } = await popover.onDidDismiss();

    if (data != undefined) {



      this.formatoFecha = data.fecha;

      switch (identificador) {
        case 'valor1':

          if (new Date(this.formatoFecha).getDay() == 0) {
            this.alertasService.message('Dione', 'Lo sentimos no se pueden utilizar fechas de corte.')
            return
          }
          this.valor1 = new Date(this.formatoFecha);
 
          break;
        case 'valor2':
          this.valor2 = new Date(this.formatoFecha);
          break;
      }
    }


  }
  filtrarGastos(ngForm:NgForm){
    let data = ngForm.value;
    this.compania = data.compania;
  if(!this.compania)  return this.alertasService.message('DIONE','Debes de seleccionar una compañia para continuar!..')
    let filtro = {
      compania:data.compania,
      moneda:data.moneda,
      estatus:data.estatus,
      valor1: new Date(format(this.valor1, 'yyy-MM-dd')).toISOString().split('T')[0],
      valor2: new Date(format(this.valor2, 'yyy-MM-dd')).toISOString().split('T')[0]
    }
    console.log('filtro', filtro)
    this.modalCtrl.dismiss(filtro)
  }
  cerrarModal(){
    this.modalCtrl.dismiss();
  }
}
