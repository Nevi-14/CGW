import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Solicitudes } from 'src/app/models/solicitudes';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { EditarSolicitudPage } from '../editar-solicitud/editar-solicitud.page';
import { AdelantoViaticosService } from 'src/app/services/adelanto-viaticos.service';
import { Router } from '@angular/router';
import { ExcelService } from 'src/app/services/excel.service';
import { AprobadoresService } from 'src/app/services/aprobadores.service';
import { CorreoService } from 'src/app/services/correo.service';
import { Usuarios } from 'src/app/models/usuarios';
import { AlertasService } from 'src/app/services/alertas.service';
import { da } from 'date-fns/locale';
import { FiltroSolicitudesPage } from '../filtro-solicitudes/filtro-solicitudes.page';
import { Notificaciones } from 'src/app/models/notificaciones';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
interface filtros {
  nombre:any,
  filtro:any, 
 }
@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.page.html',
  styleUrls: ['./solicitudes.page.scss'],
})
export class SolicitudesPage implements OnInit {
  data: Solicitudes[]=[];
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
      label:'Usuario',
      type:'radio',
      value:{nombre:'Usuario',filtro:'usuario'}
    },
    {
      label:'Descripcion',
      type:'radio',
      value:{nombre:'Descripcion',filtro:'descripcion'}
    },
  ]
aprobadores:any = [];
usuarios:Usuarios[] = [];




  constructor(
public usuariosService:UsuariosService,
public solicitudesService:SolicitudesService,
public alertCtrl:AlertController,
public modalCtrl:ModalController,
public adelantoViaticosService:AdelantoViaticosService,
public router:Router,
public excelservice:ExcelService,
public alertCrl:AlertController,
public correosService:CorreoService,
public aprobadoresService:AprobadoresService,
public alertasService:AlertasService,
public notificacionesService:NotificacionesService


  ) { }

 async ngOnInit() {
   this.cargarDatos();
   this.aprobadores = await this.aprobadoresService.syncGetAprobadoresToPromise();
   this.usuarios = await this.usuariosService.syncGetUsuariosToPromise();
   console.log(this.aprobadores,'aprobadores')
  }
  async cargarDatos(){
    this.data = await  this.solicitudesService.syncGetSolicitudesToPromise();
    this.temp = [...this.data];
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
    mode: 'ios',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {},
      },
      {
        text: 'OK',
        role: 'confirm',
        handler: (data: filtros) => {
          this.filtro = data;
        },
      },
    ],
    inputs: this.filtros,
  });

  await alert.present();
}

  // EXPORTAR EXCEL

  descargarDatos() {
    this.excelservice.exportToExcel(
      this.data.filter((e) => e.seleccionado == true).length > 0
        ? this.data.filter((e) => e.seleccionado == true)
        : this.data,
      'ControlSolictudes'
    );
  }
 



  get ordersToDisplay(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.data.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.data.length / this.pageSize);
  }

 
 async crearAnticipo(){
  const alert = await this.alertCtrl.create({
    header: 'Seleccionar Compania',
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
        handler:async  (data) => {
          
         console.log(data,'data')
         let usuariosExportar = []
         let usuarios = await this.usuariosService.syncGetUsuariosToPromise();
         let solicitudes = this.data.filter(e => e.coD_COMPANIA == data && e.estatus == 'A');
     this.adelantoViaticosService.solicitudes = [];
         console.log(solicitudes,'solicitudes')
         if(solicitudes.length == 0) return this.alertasService.message('D1ONE','Verifique que existan solicitudes aprobadas para esta compania.')
            solicitudes.forEach( (solicitud, index) => {
            let usuarioIndex = usuarios.findIndex(e => e.usuario == solicitud.usuario);
            if(usuarioIndex >= 0){
              console.log(usuarios[usuarioIndex], 'user found')
              let usuario = {
                usuario: solicitud.usuario,
               nombre: usuarios[usuarioIndex].nombre,
              clave: usuarios[usuarioIndex].clave,
              cia: solicitud.coD_COMPANIA,
              seleccionado: true,
              monto: solicitud.montO_APROBADO
           }
           this.adelantoViaticosService.solicitudes.push(usuario)
           this.adelantoViaticosService.solicitudesActualizar.push(solicitud)
            }

            if(index == solicitudes.length -1){
              console.log('usuariosExportar',usuariosExportar)
             
              console.log(this.adelantoViaticosService.solicitudes,'solicitudes')
              this.router.navigateByUrl('/inicio/registro-anticipos',{replaceUrl:true})
  
            }

            })
          
        },
      },
    ],
    inputs: [
      {
        label: 'COOK',
        type: 'radio',
        value: 'COOK',
      },
      {
        label: 'CVET',
        type: 'radio',
        value: 'CVET',
      },
      {
        label: 'CRCB',
        type: 'radio',
        value: 'CRCB',
      },
    ],
  });

  await alert.present();
}

async editarElemento(solicitud:Solicitudes) {
 
  const modal = await this.modalCtrl.create({
    component: EditarSolicitudPage,
    cssClass: 'medium-modal',
    mode: 'ios',
    componentProps: {
      solicitud
    }
  });
  await modal.present();
  const { data } = await modal.onDidDismiss();
  if (data !== undefined) {
   this.cargarDatos();
  }
 
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
          if(data == 'APROBADORES'){
            this.notificarAprobadores(); 
          }else if(data == 'FILTRO'){
            this.FiltroSolicitud();
          } else{
            this.crearAnticipo();
          }
        }
      },
    ],
    inputs: [
      {
        label: 'Notificar Aprobadores',
        type: 'radio',
        value: 'APROBADORES',
      },
      {
        label: 'Filtro Avanzado',
        type: 'radio',
        value: 'FILTRO',
      },
      {
        label: 'Crear Anticipo Colones',
        type: 'radio',
        value: 'COLONES',
      },
      {
        label: 'Crear Anticipo Dolares',
        type: 'radio',
        value: 'DOLARES',
      }
    ],
  });

  await alert.present();
}

notificarAprobadores(){
  if(this.aprobadores.length == 0) return this.alertasService.message('D1','No hay aprobadores configurados.');
  this.alertasService.presentaLoading('Notificando Aprobadores...')
  this.aprobadores.forEach( (aprobador, index) =>{
    let i  =  this.usuarios.findIndex(e => e.usuario == aprobador.usuario);
    console.log(i,'i')
    console.log(this.usuarios[i],'usuario')
    if(i >= 0){

      let notificacion:Notificaciones = {
        id : 0,
        remitente : this.usuariosService.usuario.usuario,
        usuario : aprobador.usuario,
        canal:'web',
        tipo:'N', // Registro Anticipo
        referencia:'Aprobacion de Anticipos',
        estatus:'P',
        fecha: new Date(),
        fechaLimite: new Date(),
        titulo:`Se require de su aprobacion para la solicitud de anticipos`,
        descripcion: `Se require de su aprobacion para la solicitud de anticipos`
     }
  
    
 
     this.notificacionesService.syncPostNotificacionToPromise(notificacion).then(resp =>{
     
 console.log('resp usuario notificado', resp)
     }, error =>{
     
     })


      let usuario = this.usuarios[i];
      let email = {
        toEmail:usuario.correo,
        file:null,
        subject:'Aprobacion de Solicitudes de Gastos',
        body:`
 
  <ul>
  <li>
  Se require de su aprobacion para la socituded de anticipos.
  </li>
 
  <li>
  Si tienes alguna pregunta o necesitas asistencia, no dudes en ponerte en contacto con nuestro equipo de soporte en [Correo o Teléfono de Soporte].
  
  </li>
  
  </ul>
    
   
   
  
  Gracias por confiar en [Nombre de la Plataforma/Servicio]. Estamos aquí para ayudarte.
  <br>
  <br>
  Saludos cordiales,
  <br>
  <br>
  [Nombre del Equipo de Soporte]
  <br>
  <br>
  [Nombre de la Plataforma/Servicio]
  <br>
  [Correo de Contacto de Soporte]
  <br>
  [Teléfono de Contacto de Soporte]
        `
          }
      this.correosService.syncPostEmailToPromise(email)
    }
    if(index == this.aprobadores.length -1){
      this.alertasService.loadingDissmiss();
      this.alertasService.message('D1ONE','Aprobadores Notificados!')
    }
  })
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
      
        async FiltroSolicitud(){

          const modal = await this.modalCtrl.create({
      component:FiltroSolicitudesPage,
      cssClass:'medium-modal',
      mode:'ios',
      })
      await modal.present();
      
      const {data} = await modal.onWillDismiss();
      
      console.log(data,'data')
      
      if(data){
        console.log(data,'data')
        this.solicitudesService.syncSolicitudesCompaniaMonedaEstadoRangoFechaToPromise(data.compania,data.moneda,data.estatus,data.valor1,data.valor2).then(resp =>{
          this.data = resp;
        })
      }
       };
        
}
