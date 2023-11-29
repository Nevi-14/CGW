import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EstadosCuentaService } from 'src/app/services/estados-cuenta.service';
import { EstadoCuentaPage } from '../estado-cuenta/estado-cuenta.page';
import { AlertasService } from '../../services/alertas.service';
import { CorreoService } from '../../services/correo.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { EstadosCuenta } from 'src/app/models/estadosCuenta';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AnticiposService } from 'src/app/services/anticipos.service';
import { SobrantesService } from 'src/app/models/sobrantes.service';
import { PdfService } from 'src/app/services/pdf.service';
import { GastosSinAnticipoService } from '../../services/gastos-sin-anticipo.service';
import { GastosConAnticipoService } from 'src/app/services/gastos-con-anticipo.service';
interface filtros {
  nombre:any,
  filtro:any, 
 }
@Component({
  selector: 'app-control-estados-cuenta',
  templateUrl: './control-estados-cuenta.page.html',
  styleUrls: ['./control-estados-cuenta.page.scss'],
})
export class ControlEstadosCuentaPage implements OnInit {
  isOpen: boolean = false;
  file:any = null;
  textoBuscar = "";
  multi:any ='multi';
  url = 'http://mercaderistas.di-apps.co.cr/api/get/estados/cuenta/archivo/?ID='
  @ViewChild(DatatableComponent) table: DatatableComponent;
  public columns: any[]=[];
  public data: any[]=[];
  temp = [];
  pageSize =6;
  currentPage = 1;
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
  constructor(
  public modalCtrl: ModalController,
  public alertasService: AlertasService,
  public estadosCuentaService:EstadosCuentaService ,
  public correoService: CorreoService, 
  public usuariosService: UsuariosService,
  public anticiposService:AnticiposService,
  public gastosConAnticipoService:GastosConAnticipoService,
  public sobrantesService:SobrantesService,
  public pdfService:PdfService,
  public gastosSinAnticipoService:GastosSinAnticipoService
  ) {   this.cargarDatos()}

  ngOnInit() {
   
  }

  cargarDatos(){

    this.columns = [
      { id: "referencia", label: "Referencia", size: 2},
      { id: "usuario", label: "Usuario", size: 2 },
      { id: "fecha", label: "Fecha", size: 2 },
      { id: "monto", label: "Monto", size: 2 },
      { id: "opciones", label: "Opciones", size: 2 }
  ];
  
  this.estadosCuentaService.syncGetEstadosCuentaToPromise()
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
    console.log('elemento',this.data[i])
    this.descargarEstadoDeCuenta(row)
  }
}
borrarElemento(row) {
  let i = this.data.findIndex( e => e.id == row.id);
  if(i >= 0){
    console.log('elemento',this.data[i])
  }

  console.log(row,'borrarElemento');
}

  // DATATABLE

  // TOTAL PAGINAS

  get totalPages(): number {
    return Math.ceil(this.data.length / this.pageSize);
  }
 updateFilter(event) {
  const val = event.target.value.toLowerCase();

  // filter our data
  const temp = this.temp.filter(function (d) {
  //d.nombre, d.descripcion, etc..
  console.log('d',d)
    return d.usuario.toLowerCase().indexOf(val) !== -1 || !val;
  });

  // update the data
  this.data = temp;
  // Whenever the filter changes, always go back to the first page
  this.table.offset = 0;

}

  cargarDatos2(){
this.alertasService.presentaLoading('Cargando datos..')
    this.estadosCuentaService.syncGetEstadosCuentaToPromise().then(resp =>{
this.alertasService.loadingDissmiss();
this.estadosCuentaService.estadosCuentaArray = resp;
    }, error =>{
this.alertasService.loadingDissmiss();
this.alertasService.message('APP', 'Lo sentimos algo salio mal..')

    })
  }
  filtrarData(){

  }
  enviarCorreo(estado:EstadosCuenta){
 //this.correoService.enviarCorreo(estado)
  }
  onSearchChange(event){

    this.textoBuscar = event.detail.value;
      }
  async estadoCuenta(){
    this.isOpen = true;
    
    
          const modal = await this.modalCtrl.create({
     component:EstadoCuentaPage,
     cssClass:'medium-modal'
          });
    
    if(this.isOpen){
    
      modal.present();
      const {data} = await modal.onWillDismiss();
      this.isOpen = false;
      if(data != undefined){

        this.estadosCuentaService.syncGetEstadosCuentaToPromise().then(resp =>{
          this.estadosCuentaService.estadosCuentaArray = resp;
        //  this.correoService.enviarCorreo(data.estado);
              }, error =>{
          this.alertasService.message('APP', 'Lo sentimos algo salio mal..')
          
              })


         
      }
    }
    

  }


  async descargarEstadoDeCuenta(estado:EstadosCuenta){
    this.alertasService.presentaLoading('Generando estado de cuenta...')
  console.log(estado)
      if(estado.anticipo){
  let vistaAnticipo  = await this.anticiposService.syncGetVistaAnticipoLineas(estado.usuario,estado.referencia);
  console.log(vistaAnticipo)
  let lineaAnticipo = await this.anticiposService.syncGetLineaUsuarioAnticipoBYId(vistaAnticipo[0].id)
  let gastos = await this.gastosConAnticipoService.getUsuarioGastosConAnticipoEstadoToPromise(vistaAnticipo[0].id,""); 
  let sobrantes = await this.sobrantesService.syncGetSobranteAnticipoUsuarioToPromise(estado.usuario, vistaAnticipo[0].numerO_TRANSACCION)
  this.pdfService.generatePDF(estado,gastos)
  this.alertasService.loadingDissmiss();
  
      }else{
  
          let gastos = await this.gastosSinAnticipoService.syncGetGastosSinAnticipoToPromise2(estado.usuario,'F', estado.fechA_INICIAL.split('T')[0],estado.fechA_FINAL.split('T')[0])
          this.pdfService.generatePDF(estado,gastos)
          this.alertasService.loadingDissmiss();
          
            
      }
  
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

   descargarDatos(){
    
   }


}
