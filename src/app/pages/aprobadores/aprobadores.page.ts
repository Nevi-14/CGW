import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CrearAprobadoresPage } from '../crear-aprobadores/crear-aprobadores.page';
import { AprobadoresService } from 'src/app/services/aprobadores.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { ExcelService } from 'src/app/services/excel.service';
interface filtros {
  nombre:any,
  filtro:any, 
 }
@Component({
  selector: 'app-aprobadores',
  templateUrl: './aprobadores.page.html',
  styleUrls: ['./aprobadores.page.scss'],
})
export class AprobadoresPage implements OnInit {
  temp = [];
  isOpen:boolean = false;
  public data: any[]=[];
  pageSize = 6;
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
    }
  ]
  constructor(
public usuariosService:UsuariosService,
public modalCtrl:ModalController,
public aprobadoresService:AprobadoresService,
public alertCrl:AlertController,
public alertasService:AlertasService,
public excelservice:ExcelService

  ) { }

  ngOnInit() {
    this.cargarDatos();
    
  }

  cargarDatos(){
    this.alertasService.presentaLoading('Cargando datos...');
    this.aprobadoresService.syncGetAprobadoresToPromise().then((data:any)=>{
      this.alertasService.loadingDissmiss();
      this.temp = [...data];
      this.data = data;
    }, error =>{
      this.alertasService.loadingDissmiss();
      this.alertasService.message('D1','Error cargando aprobadores...');
      console.log(error)
    })
  }
  // DATATABLE

 
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
      'ControlAprobadores'
    );
  }

  async editarElemento(item:any){
    const alert = await this.alertCrl.create({
      header:`Editar ${item.nombre} ${item.apellido}`,
      subHeader: '¿Qué deseas hacer?',
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
          handler: (data) => {
            if(data == 'COMPANIA'){
              this.editarCompania(item)
            }else{
              this.editarRole(item)
            }
          },
        },
      ],
      inputs: [
        {
          label:'Editar Compañia',
          type:'radio',
          value:'COMPANIA'
        },
        {
          label:'Editar Role',
          type:'radio',
          value:'ROLE'
        }
      ]
    });

    await alert.present();
  }

  async editarCompania(item:any){
    const alert = await this.alertCrl.create({
      header:`Editar ${item.nombre} ${item.apellido}`,
      subHeader: 'Selecciona la compañia',
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
          handler: (data) => {
            item.coD_COMPANIA = data;
            this.aprobadoresService.syncPutAprobadorToPromise(item).then((data:any)=>{
              this.alertasService.message('D1','Compañia actualizada correctamente');
              this.cargarDatos();
            })
           
          },
        },
      ],
      inputs: [
        {
          label:'COOK',
          type:'radio',
          value:'COOK'
        },
        {
          label:'CVET',
          type:'radio',
          value:'CVET'
        },
        {
          label:'CRCB',
          type:'radio',
          value:'CRCB'
        },
        {
          label:'TODAS',
          type:'radio',
          value:'TODAS'
        }
      ]
    });

    await alert.present();
  }

  async editarRole(item:any){
    const alert = await this.alertCrl.create({
      header:`Editar ${item.nombre} ${item.apellido}`,
      subHeader: 'Selecciona el role',
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
          handler: (data) => {
            item.role = data;
            this.aprobadoresService.syncPutAprobadorToPromise(item).then((data:any)=>{
              this.alertasService.message('D1','Role actualizado correctamente');
              this.cargarDatos();
            })
           
          },
        },
      ],
      inputs: [
        {
          label:'Aprobador Solicitudes',
          type:'radio',
          value:'01'
        },
        {
          label:'Aprobador Anticipo',
          type:'radio',
          value:'02'
        },
        {
          label:'Ambos Roles',
          type:'radio',
          value:'03'
        }
      ]
    });

    await alert.present();
  }



  // DATATABLE

  // TOTAL PAGINAS

  get totalPages(): number {
    return Math.ceil(this.data.length / this.pageSize);
  }

  async crearAprobador( ){
    this.isOpen = true;
        
          const modal = await this.modalCtrl.create({
     component:CrearAprobadoresPage,
     cssClass:'medium-modal',
     mode:'ios',
 
          });
    
    if(this.isOpen){
    
      modal.present();
      const {data} = await modal.onWillDismiss();
      this.isOpen = false;
      if(data != undefined){
 this.cargarDatos();
         
      }
    }
    

  }

  // editar es un alert con select y actualzia role

  async borrarElemento(aprobador:any){
    const alert = await this.alertCrl.create({
      subHeader:'D1',
      message:`¿Desea borrar el aprobador?`,
      mode:'ios',
      buttons:[
        {
          text:'cancelar',
          role:'cancel',
          handler:()=>{
            console.log('cancel')
          }
        },
        {
          text:'continuar',
          role:'confirm',
          handler:async ()=>{
            this.alertasService.presentaLoading('Borrando aprobador...')
            this.aprobadoresService.syncDeleteAprobadorToPromise(aprobador.id).then((data:any)=>{
              this.alertasService.loadingDissmiss();
              this.alertasService.message('D1','Aprobador borrado correctamente'); 
              this.cargarDatos();
            }, error =>{
              this.alertasService.loadingDissmiss();
              this.alertasService.message('D1','Ocurrio un error al borrar el aprobador'); 
              console.log(error)
            })
 
          }
        }
      ]
    })
    alert.present();
  
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
