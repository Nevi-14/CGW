import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { adelantoViaticos } from 'src/app/models/adelantoViaticos';
import { AdelantoViaticosService } from 'src/app/services/adelanto-viaticos.service';
import { AlertasService } from '../../services/alertas.service';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Usuarios } from 'src/app/models/usuarios';
import { AprobadoresService } from 'src/app/services/aprobadores.service';
import { CorreoService } from 'src/app/services/correo.service';
import { ExcelService } from 'src/app/services/excel.service';
import { FiltroAnticiposPage } from '../filtro-anticipos/filtro-anticipos.page';
import { AnticiposService } from 'src/app/services/anticipos.service';
import { Notificaciones } from 'src/app/models/notificaciones';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
interface filtros {
  nombre:any,
  filtro:any, 
 }
@Component({
  selector: 'app-control-anticipos',
  templateUrl: './control-anticipos.page.html',
  styleUrls: ['./control-anticipos.page.scss'],
})
export class ControlAnticiposPage   {
  isOpen: boolean = false;
  adelantoViaticosArray:adelantoViaticos[]=[];
  textoBuscar = "";
  @ViewChild(DatatableComponent) table: DatatableComponent;
  public columns: any;
  public data: any[]=[];
  multi:any ='multi';
  temp = [];
  pageSize = 6;
  currentPage = 1;
  filtro:filtros = {nombre:'Compania',filtro:'coD_COMPANIA'}
  filtros:any = [
    {
      label:'Compania',
      type:'radio',
      value:{nombre:'Compania',filtro:'coD_COMPANIA'}
    },
    {
      label:'Detalle',
      type:'radio',
      value:{nombre:'Detalle',filtro:'detalle'}
    },
    {
      label:'Asiento Apertura',
      type:'radio',
      value:{nombre:'Asiento Apertura',filtro:'asiento'}
    },
    {
      label:'Asiento Cierre',
      type:'radio',
      value:{nombre:'Asiento Cierre',filtro:'asientO_CIERRE'}
    },
  ]
  aprobadores:any = [];
usuarios:Usuarios[] = [];
  constructor(
public modalCtrl: ModalController,
public adelantoViaticosService:AdelantoViaticosService,
public alertasService: AlertasService,
public router:Router,
public usuariosService: UsuariosService,
public alertCrl:AlertController,
public aprobadoresService:AprobadoresService,
public correosService:CorreoService,
public excelservice:ExcelService,
public anticiposService:AnticiposService,
public notificacionesService:NotificacionesService


  ) { }


  get totalPages(): number {
    return Math.ceil(this.data.length / this.pageSize);
  }


async  cargarDatos(){
    this.aprobadores = await this.aprobadoresService.syncGetAprobadoresToPromise();
    this.usuarios = await this.usuariosService.syncGetUsuariosToPromise();
    console.log(this.aprobadores,'aprobadores')
    this.columns = [
      { id: "estatus", label: "Estatus", size: 1},
      { id: "coD_COMPANIA", label: "Compañia", size: 2 },
      { id: "fechA_INICIAL", label: "Fecha Inicial", size: 2 },
      { id: "fechA_FINAL", label: "Fecha Final", size: 2 },
      { id: "moneda", label: "Moneda", size: 1 },
      { id: "monto", label: "Monto", size: 2 },
      { id: "opciones", label: "Opciones", size: 2 }
  ];
  this.adelantoViaticosService.syncGetAdelantoViaticosToPromise()
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
    this.detalleAdeltanto(this.data[i])
  }
}
borrarElemento(row) {
  let i = this.data.findIndex( e => e.id == row.id);
  if(i >= 0){
    console.log('elemento',this.data[i])
  }
  this.alertasService.message('D1', 'La opción no se encuentra disponible..');
  console.log(row,'borrarElemento');
}


 //  FILTRO BUSQUEDA

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


  // OPCIONES DE FILTRO


  async filtrarData() {
    const alert = await this.alertCrl.create({
      header: 'Opciones de filtro',
      mode:'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: ( ) => {
            
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: (data:filtros) => {
            this.filtro = data;
          },
        },
      ],
      inputs: this.filtros
    });

    await alert.present();
  }

  // EXPORTAR EXCEL

  descargarDatos() {
    this.excelservice.exportToExcel(
      this.data.filter((e) => e.seleccionado == true).length > 0
        ? this.data.filter((e) => e.seleccionado == true)
        : this.data,
      'ControlAnticipos'
    );
  }



 

  ionViewWillEnter() {
    this.adelantoViaticosService.adelantoViatico  = null;
    this.cargarDatos();
  }
  onSearchChange(event){

    this.textoBuscar = event.detail.value;
      }
  async cargarDatos2(){
this.alertasService.presentaLoading('Cargando datos...');
this.adelantoViaticosService.syncGetAdelantoViaticosToPromise().then(resp =>{
 this.alertasService.loadingDissmiss();
  this.adelantoViaticosArray = resp;

}, error =>{
  this.alertasService.loadingDissmiss();
  this.alertasService.message('D1', 'Lo sentimos algo salio mal..')
})

  }

  correo(){
    this.alertasService.message('D1', 'La opción no se encuentra disponible..')
  }
  async adelantoViaticos(){

    this.router.navigateByUrl('/inicio/registro-anticipos', {replaceUrl:true});

  
    

  }
  async FiltroAnticipo(){

    const modal = await this.modalCtrl.create({
component:FiltroAnticiposPage,
cssClass:'medium-modal',
mode:'ios',
})
await modal.present();

const {data} = await modal.onWillDismiss();

console.log(data,'data')

if(data){
  this.anticiposService.syncAnticipoCompaniaMonedaEstadoRangoFechaToPromise(data.compania,data.moneda,data.estatus,data.valor1,data.valor2).then(resp =>{
    this.data = resp;
  })
}
 };



  async detalleAdeltanto(adelanto:adelantoViaticos){
    this.adelantoViaticosService.adelantoViatico = adelanto;
    this.router.navigateByUrl('inicio/detalle-anticipo')
  }

  async accionSolicitudes() {
    const alert = await this.alertCrl.create({
      header: '¿Que desea hacer?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cacelar',
          role: 'cancel',
          handler: () => {
            
          },
        },
        {
          text: 'Continuar',
          role: 'confirm',
          handler: (data) => {
            console.log(data,'data')
            if(data == 'FILTRO'){
              this.FiltroAnticipo();
           
            } else{
              this.adelantoViaticos();
            }
          }
        },
      ],
      inputs: [
        {
          label: 'Filtro Avanzado',
          type: 'radio',
          value: 'FILTRO',
        },
        {
          label: 'Crear Anticipo',
          type: 'radio',
          value: 'ANTICIPO',
        }
      ],
    });
  
    await alert.present();
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
