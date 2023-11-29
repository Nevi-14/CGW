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
import { UsuariosService } from 'src/app/services/usuarios.service';
interface usuariosGastos {
usuario :string,
pendientes:number,
utilizado:number,
gastos:GastoSinAnticipo[]  
} 
interface filtros {
  nombre:any,
  filtro:any, 
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
  data:any[] = [];
  rows = [];
  temp:any[] = [];
  pageSize = 3;
  currentPage = 1;
  filtro:filtros = {nombre:'Usuario',filtro:'usuario'}
  constructor(
public gastosSinanticipoService:GastosSinAnticipoService,
public graficosService:GraficosService,
public modalCtrl:ModalController,
public alertasService:AlertasService,
public tiposGastosSerivce:TiposGastosService,
public cd:ChangeDetectorRef,
public usuariosService:UsuariosService

  ) { }

  getBadgeColor(estatus: string) {
    switch (estatus) {
      case 'P':
        return 'primary';
      case 'RA':
        return 'warning';
      case 'A':
        return 'success';
      case 'R':
        return 'danger';
      default:
        return 'primary';
    }
  }

  


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
      cssClass: 'medium-modal',
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
  segmentChanged(data:any) {
    this.segment = data;
    this.cargarGastos(this.segment)
    //this.linaAnticiposService.s
  }
  async lineaGastos(usuario: usuariosGastos) {
console.log(usuario,'gastoooooooos')

    this.isOpen = true;

    const modal = await this.modalCtrl.create({
      component: LineaGastosSinAnticipoPage,
      cssClass: 'medium-modal',
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
  cargarGastos(estado) {
    this.utilizado = 0;
    this.gastos = [];
    this.p = 0;
    this.ra = 0;
    this.a = 0;
    this.r = 0;
    this.data = [];
    this.temp = [];
  
    this.gastosSinanticipoService.gastos.forEach((gasto, index) => {
      this.utilizado += gasto.monto;
      switch (gasto.estatus) {
        case 'P':
          this.p += 1;
          if(gasto.estatus == this.segment){
           this.data.push(gasto)
          }
          break;
        case 'RA':
          this.ra += 1;
          if(gasto.estatus == this.segment){
            this.data.push(gasto)
           }
          break;
        case 'A':
          this.a += 1;
          if(gasto.estatus == this.segment){
            this.data.push(gasto)
           }
          break;
        case 'R':
          this.r += 1;
          if(gasto.estatus == this.segment){
            this.data.push(gasto)
           }
          break;
      }
  
      if (gasto.estatus == estado) {
        let gastoUsuario = {
          usuario: gasto.usuario,
          pendientes: 0,
          utilizado: 0,
          gastos: [gasto]
        }
  
        let i = this.gastos.findIndex(e => e.usuario == gasto.usuario);
        if (i < 0) {
          this.gastos.push(gastoUsuario);
          if (gasto.estatus == 'P' || gasto.estatus == 'RA' || gasto.estatus == 'R') {
            gastoUsuario.pendientes = 1;
          }
          gastoUsuario.utilizado += gasto.monto;
        }
  
        if (i >= 0) {
          if (gasto.estatus == 'P' || gasto.estatus == 'RA' || gasto.estatus == 'R') {
            this.gastos[i].pendientes = 1;
          }
          this.gastos[i].utilizado += gasto.monto;
          this.gastos[i].gastos.push(gasto);
        }
  
        // Resto de tu código...
        this.cargarGraficos();
      }
    });
  }
  cargarGraficos() {
    this.temp = [...this.data];
    this.graficosService.labels = [];
    this.graficosService.data = [];
    this.tiposGastosSerivce.getgastosToPromise().then((resp) => {
      this.tiposGastosSerivce.tiposGastos = resp;
      resp.forEach(async (tipo, index) => {
        if (tipo.descripcion) { // Verifica que la descripción no esté vacía
          // Solo agrega la etiqueta si hay al menos un gasto de este tipo y no se ha agregado aún
          if (this.gastos.some(usuario => usuario.gastos.some(gasto => gasto.iD_TIPO_GASTO == tipo.tipo)) && !this.graficosService.labels.includes(tipo.descripcion)) {
            this.graficosService.labels.push(tipo.descripcion);
            this.graficosService.data.push(0);
          }
        }
        if (index == resp.length - 1) {
          this.gastos.forEach(async (usuario, index) => {
            usuario.gastos.forEach(async (gasto, indexGasto) => {
              let tipoGasto = this.tiposGastosSerivce.tiposGastos.findIndex(e => e.tipo == gasto.iD_TIPO_GASTO);
              let iD_TIPO_GASTO = null;
              if (tipoGasto >= 0) {
                iD_TIPO_GASTO = this.tiposGastosSerivce.tiposGastos[tipoGasto].descripcion;
              }
              let i = this.graficosService.labels.findIndex(e => e == iD_TIPO_GASTO);
              if (i >= 0) {
                this.graficosService.data[i] += 1;
              }
              if (indexGasto == usuario.gastos.length - 1) {
                await this.alertasService.loadingDissmiss();
                this.graficosService.cargarGRaficos();
              }
            })
            if (index == this.gastos.length - 1) {
              await this.alertasService.loadingDissmiss();
            }
          })
        }
      })
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

  get totalPages(): number {
    return Math.ceil(this.data.length / this.pageSize);
  }

  async createTxtFileFromArray() {
    let array = [];
    let promises = this.totalLineas.map(async (linea) => {
      let usuario = await this.usuariosService.getUsuarioToPromise(linea.usuario);
      let data = `..,${usuario[0].nombre}  ${usuario[0].apellido},..,${linea.monto},PAGO DE VIATICOS DEL ..).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} AL  ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })},CODIGO 150`;
      array.push(data);
    });
  }
  
  updateFilter(event, filtro: filtros) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return d[filtro.filtro].toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the data
    this.data = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }
      // PAGINATED DATA
      get paginatedData(): any[] {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        return this.data.slice(startIndex, startIndex + this.pageSize);
      }
      
      // NEXT PAGE
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
        }
      }
      
      // PREVIOUS PAGE
      previousPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      }
       
      
        // SELECCIONAR TODO
        selectAll(event) {
          if (event.detail.checked) {
            this.data.forEach((item) => {
              item.seleccionado = true;
            });
          } else {
            this.data.forEach((item) => {
              item.seleccionado = false;
            });
          }
        }

}
