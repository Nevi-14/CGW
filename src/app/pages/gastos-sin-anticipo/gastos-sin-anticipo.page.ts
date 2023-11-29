import { Component, OnInit, ViewChild } from '@angular/core';
import { GastoSinAnticipo } from 'src/app/models/gastoSinAnticipo';
import { AlertasService } from 'src/app/services/alertas.service';
import { GastosSinAnticipoService } from 'src/app/services/gastos-sin-anticipo.service';
import { LiquidacionSinAnticipoPage } from '../liquidacion-sin-anticipo/liquidacion-sin-anticipo.page';
import { AlertController, ModalController } from '@ionic/angular';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { CompaniasService } from 'src/app/services/companias.service';
import { FiltroGastosSinAnticipoPage } from '../filtro-gastos-sin-anticipo/filtro-gastos-sin-anticipo.page';
import { format } from 'date-fns';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { VisorArchivosPage } from '../visor-archivos/visor-archivos.page';
import { saveAs } from 'file-saver';
interface filtros {
  nombre:any,
  filtro:any, 
 }
@Component({
  selector: 'app-gastos-sin-anticipo',
  templateUrl: './gastos-sin-anticipo.page.html',
  styleUrls: ['./gastos-sin-anticipo.page.scss'],
})
export class GastosSinAnticipoPage implements OnInit {
  gastosSinAnticipo:GastoSinAnticipo[]=[];
  pageSize = 3;
  currentPage = 1;
  isOpen:boolean = false;
  filtro:filtros = {nombre:'Usuario',filtro:'usuario'}
  filtros:any = [
    {
      label:'Usuario',
      type:'radio',
      value:{nombre:'Usuario',filtro:'usuario'}
    },
    {
      label:'Nombre',
      type:'radio',
      value:{nombre:'Nombre',filtro:'nombre'}
    },
    {
      label:'Apellido',
      type:'radio',
      value:{nombre:'Apellido',filtro:'apellido'}
    },
  ]
  @ViewChild(DatatableComponent) table: DatatableComponent;
  public columns: any;
  multi:any ='multi';
  public data:GastoSinAnticipo []=[];
  
  temp:GastoSinAnticipo [] = [];
  lineas: any[] = []
  totalLineas: any[] = []
  lineasPendientes = 0;
  gastos = [];
  img = null
  file: any = null;
  p = 0;
  ra = 0;
  a = 0;
  r = 0;
  segment = 'P';
  firstDataLoad = false;
  cuentaAnticipo = null;
  cuentaBancostilizar = null;
  constructor(
public alertasService:AlertasService,
public gastosSinAnticipoService:GastosSinAnticipoService,
public modalCtrl:ModalController,
public router:Router,
public alertCtrl:AlertController,
public companiasService:CompaniasService,
public usuariosService:UsuariosService

  ) { this.cargarDatos()}

  get totalPages(): number {
    return Math.ceil(this.data.length / this.pageSize);
  }
  

  async createTxtFileFromArray() {
    let array = [];
    let promises = this.totalLineas.map(async (linea) => {
      let usuario = await this.usuariosService.getUsuarioToPromise(linea.usuario);
      let data = `${this.cuentaBancostilizar.cuenta},${usuario[0].nombre}  ${usuario[0].apellido},${this.cuentaAnticipo.cuenta},${linea.monto},PAGO DE VIATICOS DEL ${new Date(this.gastosSinAnticipoService.fechaInicioMes).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} AL  ${new Date(this.gastosSinAnticipoService.fechaFinMes).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })},CODIGO 150`;
      array.push(data);
    });
  
    await Promise.all(promises);
  
    let filename = 'LibroViaticos.txt';
    const blob = new Blob([array.join('\n')], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, filename);
  }
  segmentChanged(data) {
    this.segment = data;
  //  console.log('event', $event)
    //this.cargarDatos(data)
    //this.linaAnticiposService.s
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

  cargarDatos(){
    this.gastosSinAnticipoService.moneda = null;
    this.gastosSinAnticipoService.filtro  = {
      compania:null,
      moneda:null,
      estatus:null,
      valor1: new Date(format(new Date(), 'yyy-MM-dd')).toISOString().split('T')[0],
      valor2: new Date(format(new Date(), 'yyy-MM-dd')).toISOString().split('T')[0]
    }

    this.gastosSinAnticipoService.compania = null;
    this.columns = [
      { id: "referencia", label: "Referencia", size: 2},
      { id: "compania", label: "Compañia", size: 2 },
      { id: "estatus", label: "Estatus", size: 2 },
      { id: "usuario", label: "Usuario", size: 2 },
      { id: "fechA_INICIAL", label: "Fecha Inicial", size: 2 },
      { id: "moneda", label: "Moneda", size: 2 },
      { id: "monto", label: "Monto", size: 2 },
      { id: "descripcion", label: "Descripcion", size: 2 },
      { id: "opciones", label: "Opciones", size: 2 }
  ]; 

   
  this.gastosSinAnticipoService.syncGetGastosSinAnticipoToPromise()
      .then((res) => { 
        console.log(res)
        this.temp = [...res];

      // push our inital complete list
      this.data = res;
      });
  }
editarElemento(row) {
  console.log(row,'editarElemento');
  let i = this.data.findIndex( e => e.id == row.id);
  if(i >= 0){
    console.log('this.data[i]',this.data[i])
  }
}
borrarElemento(row) {
  let i = this.data.findIndex( e => e.id == row.id);
  if(i >= 0){
    console.log('this.data[i]',this.data[i])
  }

  console.log(row,'borrarElemento');
}
async filtroGastosSinAnticipo() {
  const modal = await this.modalCtrl.create({
    component: FiltroGastosSinAnticipoPage,
    cssClass: 'medium-modal',
    mode:'ios'
  })

  modal.present();
  const { data } = await modal.onWillDismiss();
  if (data != undefined) {
    console.log(data, 'filtro')
    this.gastosSinAnticipoService.compania = null;
    this.gastosSinAnticipoService.filtro = data;
     this.cargarDatosFiltro(data.compania,data.moneda,data.estatus == 'todos' ? '' : data.estatus,data.valor1,data.valor2)
   

  }
}
 


cargarDatosFiltro(compania,moneda,estado,valor1,valor2){

  this.columns = [
    { id: "referencia", label: "Referencia", size: 2},
    { id: "compania", label: "Compañia", size: 2 },
    { id: "estatus", label: "Estatus", size: 2 },
    { id: "usuario", label: "Usuario", size: 2 },
    { id: "fechA_INICIAL", label: "Fecha Inicial", size: 2 },
    { id: "moneda", label: "Moneda", size: 2 },
    { id: "monto", label: "Monto", size: 2 },
    { id: "descripcion", label: "Descripcion", size: 2 }
]; 

 
this.gastosSinAnticipoService.syncGetGastosSinAnticipoCompaniaMonedaEstadoRangoFechaToPromise(compania,moneda,estado,valor1,valor2)
    .then((res) => { 
      console.log(res)
      this.temp= [...res];

    // push our inital complete list
    this.data = res;
    });
}
//  updateFilter(event) {
//   const val = event.target.value.toLowerCase();

//   // filter our data
//   const temp = this.temp.filter(function (d) {
//   //d.nombre, d.descripcion, etc..
//   console.log('d',d)
//     return d.usuario.toLowerCase().indexOf(val) !== -1 || !val;
//   });

//   // update the data
//   this.data = temp;
//   // Whenever the filter changes, always go back to the first page
//   this.table.offset = 0;

// }

get ordersToDisplay(): any[] {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  return this.data.slice(startIndex, startIndex + this.pageSize);
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
  ngOnInit() {
 
  }
  onSearchChange($event){
    
  }

  async seleccionarCompania(){
    
    if(this.gastosSinAnticipoService.filtro.compania){
     return this.liquidacionGastos();
    }
 let companias = await this.companiasService.syncGetCompaniasToPromise();
 let inputs = [];
 companias.forEach( async (compania, index) =>{
let label = 
{
  label: compania.nombre,
  type: 'radio',
  value: compania,
}
inputs.push(label);
  if(companias.length -1 == index){
    const alert = await this.alertCtrl.create({
      header: 'D1',
      subHeader:'Seleccione una compañia',
      mode:'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: (data) => {
            console.log(data,'companias')
            this.gastosSinAnticipoService.filtro  = {
              compania:null,
              moneda:null,
              estatus:null,
              valor1: new Date(format(new Date(), 'yyy-MM-dd')).toISOString().split('T')[0],
              valor2: new Date(format(new Date(), 'yyy-MM-dd')).toISOString().split('T')[0]
            }
        this.gastosSinAnticipoService.compania =   data;
            this.liquidacionGastos();
          },
        },
      ],
      inputs: inputs,
    });

    await alert.present();
  }
 })   
 
  
  }

  filtrarData(){

  }
  descargarDatos(){
    
  }
  liquidarGastos(){
    this.alertasService.message('D1','Ajustando cambios en  modulo, estara diponible el dia Viernes en la reunion que tendremos.')
  }
  liquidacionGastos(){
   
   if(this.gastosSinAnticipoService.moneda){
    return       this.router.navigateByUrl('/inicio/liquidacion-gastos-sin-anticipo',{replaceUrl:true})
   }
    let dolares =  this.data.filter(e =>  e.moneda == '$' && e.compania ==  this.gastosSinAnticipoService.compania.nombre);
    let colones = this.data.filter(e => e.moneda == '¢' && e.compania ==  this.gastosSinAnticipoService.compania.nombre)

    console.log(dolares, colones)

    if(dolares.length > 0 && colones.length > 0){
      this.seleccionaeMoneda(dolares,colones);
      return
    }

    if(dolares.length > 0){
       this.gastosSinAnticipoService.moneda = '$';
    }

    if(colones.length > 0){
      this.gastosSinAnticipoService.moneda = '¢';
    }

 this.gastosSinAnticipoService.gastos = this.data.filter( e => this.gastosSinAnticipoService.compania ?  e.compania ==  this.gastosSinAnticipoService.compania.nombre   :   e.compania == this.gastosSinAnticipoService.filtro.compania )
    this.router.navigateByUrl('/inicio/liquidacion-gastos-sin-anticipo',{replaceUrl:true})
  }

  async seleccionaeMoneda(dolares,colones) {
    const alert = await this.alertCtrl.create({
      header: 'D1',
      subHeader:'Se han detectado 2 tipos de monedas, seleccione una moneda para proceder!..',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (data) => {
           
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: (data) => {
            this.gastosSinAnticipoService.moneda = data;

            if(data == '¢' ){
              this.gastosSinAnticipoService.gastos = colones;
            }else if(data == '$' ){
              this.gastosSinAnticipoService.gastos = dolares;
            }
            this.liquidacionGastos();
          },
        },
      ],
      inputs: [
        {
          label: 'Dolares',
          type: 'radio',
          value: '$',
        },
        {
          label: 'Colones',
          type: 'radio',
          value: '¢',
        } 
      ],
    });

    await alert.present();
  }

 


 
}
