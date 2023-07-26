import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { GastoSinAnticipo } from 'src/app/models/gastoSinAnticipo';
import { GastosSinAnticipoService } from 'src/app/services/gastos-sin-anticipo.service';
import { GraficosService } from 'src/app/services/graficos.service';
import { EstadisticasPage } from '../estadisticas/estadisticas.page';
import { ModalController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import { TiposGastosService } from 'src/app/services/tipos-gastos.service';
import { LineaGastosSinAnticipoPage } from '../linea-gastos-sin-anticipo/linea-gastos-sin-anticipo.page';
import { LiquidacionSinAnticipoPage } from '../liquidacion-sin-anticipo/liquidacion-sin-anticipo.page';
interface usuariosGastos {
usuario :string,
pendientes:number,
utilizado:number,
gastos:GastoSinAnticipo[]  
} 
@Component({
  selector: 'app-liquidacion-gastos-sin-anticipo',
  templateUrl: './liquidacion-gastos-sin-anticipo.page.html',
  styleUrls: ['./liquidacion-gastos-sin-anticipo.page.scss'],
})
export class LiquidacionGastosSinAnticipoPage implements OnInit {
  isOpen: boolean = false;
  lineas: GastoSinAnticipo[] = []
  totalLineas: GastoSinAnticipo[] = []
  lineasPendientes = 0;
  gastos:usuariosGastos[] = [];
  img = null
  file: any = null;
  p = 0;
  ra = 0;
  a = 0;
  r = 0;
  segment = 'P';
  identificador = null;
  utilizado = 0;
  constructor(
public gastosSinanticipoService:GastosSinAnticipoService,
public graficosService:GraficosService,
public modalCtrl:ModalController,
public alertasService:AlertasService,
public tiposGastosSerivce:TiposGastosService,
public cd:ChangeDetectorRef

  ) { }

  ngOnInit() {
    console.log('gastos', this.gastosSinanticipoService.gastos)
 
    this.identificador = (this.gastosSinanticipoService.filtro.compania ? this.gastosSinanticipoService.filtro.valor1 : this.gastosSinanticipoService.fechaInicioMes) + (this.gastosSinanticipoService.filtro.compania ? this.gastosSinanticipoService.filtro.valor2  : this.gastosSinanticipoService.fechaFinMes)
   
   console.log(this.gastosSinanticipoService.compania,'compania', this.gastosSinanticipoService.filtro,'filtro')
   this.cargarGastos(this.segment);
  }
  async mostrarEstadisiticas() {

    this.isOpen = true;

    const modal = await this.modalCtrl.create({
      component: EstadisticasPage,
      cssClass: 'alert-modal',
      mode: 'ios'
    });

    if (this.isOpen) {

      modal.present();
      const { data } = await modal.onWillDismiss();
      this.isOpen = false;
      if (data != undefined) {


      }

    }
  }
  segmentChanged($event:any) {
    console.log('event', $event)
    this.cargarGastos($event.detail.value)
    //this.linaAnticiposService.s
  }
  async lineaGastos(usuario: usuariosGastos) {
console.log(usuario,'gastoooooooos')

    this.isOpen = true;

    const modal = await this.modalCtrl.create({
      component: LineaGastosSinAnticipoPage,
      cssClass: 'alert-modal',
      mode: 'ios',
      componentProps: {
        gastosSinAnticipo:usuario
      }
    });

    if (this.isOpen) {

      modal.present();
      const { data } = await modal.onWillDismiss();
      this.isOpen = false;
      if (data != undefined) {


      }

    }
  }
 async  cargarGastos(estado) {
  this.utilizado = 0;
  this.gastos = [];

            
  this.p = 0;
  this.ra = 0;
  this.a = 0;
  this.r = 0;

 
 
  this.gastosSinanticipoService.gastos.forEach( (gasto, index) =>{
    switch (gasto.estatus) {
      case 'P':
        this.p += 1;
        break;
      case 'RA':
        this.ra += 1;
        break;
      case 'A':
        this.a += 1;
        break;
      case 'R':
        this.r += 1;
        break;
    }
    this.utilizado  += gasto.monto
if(gasto.estatus == estado){
 
  let gastoUsuario = {
  usuario :gasto.usuario,
  pendientes:0,
  utilizado:0,
  gastos:[gasto] 
      }
  let i = this.gastos.findIndex(e => e.usuario == gasto.usuario);
  if(i < 0){
  if(  gasto.estatus == 'P' || gasto.estatus == 'RA' || gasto.estatus == 'R'){
  gastoUsuario.pendientes = 1;
  }
  gastoUsuario.utilizado += gasto.monto
  this.gastos.push(gastoUsuario)
  }
  
  if(i >=0){
  if(   gasto.estatus == 'P' || gasto.estatus == 'RA' || gasto.estatus == 'R'){
    this.gastos[i].pendientes = 1;
  }
  gastoUsuario.utilizado += gasto.monto
  this.gastos[i].gastos.push(gasto)
  }
  
  if( this.gastosSinanticipoService.gastos.length -1  == index){
  console.log('gastos3', this.gastos)
 
   let gastos = this.gastos
  this.lineasPendientes = this.gastos.filter(e => e.pendientes > 0).length;
 



  this.graficosService.labels = [];
  this.graficosService.data = [];
  //this.alertasService.presentaLoading('Cargando datos...')
  this.tiposGastosSerivce.getgastosToPromise().then((resp) => {
  
    this.tiposGastosSerivce.tiposGastos = resp;
    resp.forEach(async (tipo, index) => {
      this.graficosService.labels.push(tipo.descripcion)
      this.graficosService.data.push(0)
      if (index == resp.length - 1) {
   this.gastos = gastos;
   

    this.gastos.forEach(async (usuario, index) => {

      usuario.gastos.forEach(async (gasto, indexGasto) =>{

        let tipoGasto =   this.tiposGastosSerivce.tiposGastos.findIndex( e => e.id ==  gasto.iD_TIPO_GASTO);
        let iD_TIPO_GASTO = null;
        if(tipoGasto >=0){
          iD_TIPO_GASTO = this.tiposGastosSerivce.tiposGastos[tipoGasto].descripcion;
        }
         console.log('gasto',gasto)
          let i = this.graficosService.labels.findIndex(e => e == iD_TIPO_GASTO);
          if (i >= 0) {
            this.graficosService.data[i] += 1;
          }
       
        if (indexGasto == usuario.gastos.length - 1) {
        
          await this.alertasService.loadingDissmiss();
          this.graficosService.cargarGRaficos();
        }

      })

      if(index == this.gastos.length -1){
    
        await this.alertasService.loadingDissmiss();
      }
      })
      }
    })


  })


  }
}

if(this.gastosSinanticipoService.gastos.length -1 == index){
  this.lineasPendientes = this.gastos.filter(e => e.pendientes > 0).length;
  if( this.lineasPendientes == 0){
    this.segment = 'RA'
    this.cd.detectChanges();
   this.cargarGastos('RA')
  }
}
  })













 
 
  }

  async liquidacionAnticipo() {
 
    let gastos = [];

    this.gastosSinanticipoService.gastos.forEach( async(usuario, indexU) =>{
 

        gastos = gastos.concat(usuario)
        if(this.gastosSinanticipoService.gastos.length -1 == indexU){
          this.isOpen = true;
  
          const modal = await this.modalCtrl.create({
            component: LiquidacionSinAnticipoPage,
            cssClass: 'large-modal',
            mode:'ios',
            componentProps:{
              gastos: gastos
            }
          });
      
          if (this.isOpen) {
      
            modal.present();
            const { data } = await modal.onWillDismiss();
            this.isOpen = false;
            if (data != undefined) {
         
      
            }
      
          }
        }
       
    })

  
 
  }
}
