import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { estadosCuenta } from 'src/app/models/estadosCuenta';
import { EstadosCuentaService } from 'src/app/services/estados-cuenta.service';
import { EstadoCuentaPage } from '../estado-cuenta/estado-cuenta.page';
import { AlertasService } from '../../services/alertas.service';
import { CorreoService } from '../../services/correo.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-control-estados-cuenta',
  templateUrl: './control-estados-cuenta.page.html',
  styleUrls: ['./control-estados-cuenta.page.scss'],
})
export class ControlEstadosCuentaPage implements OnInit {
  isOpen: boolean = false;
  estadosCuentaArray:estadosCuenta[]=[]
  file:any = null;
  textoBuscar = "";
  url = 'http://mercaderistas.di-apps.co.cr/api/get/estados/cuenta/archivo/?ID='
  constructor(
  public modalCtrl: ModalController,
  public alertasService: AlertasService,
  public estadosCuentaService:EstadosCuentaService ,
  public correoService: CorreoService, 
  public usuariosService: UsuariosService
  ) { }

  ngOnInit() {
    this.cargarDatos();
  }



  cargarDatos(){
this.alertasService.presentaLoading('Cargando datos..')
    this.estadosCuentaService.syncGetEstadosCuentaToPromise().then(resp =>{
this.alertasService.loadingDissmiss();
this.estadosCuentaArray = resp;
    }, error =>{
this.alertasService.loadingDissmiss();
this.alertasService.message('APP', 'Lo sentimos algo salio mal..')

    })
  }

  enviarCorreo(estado:estadosCuenta){
 this.correoService.enviarCorreo(estado)
  }
  onSearchChange(event){

    this.textoBuscar = event.detail.value;
      }
  async estadoCuenta(){
    this.isOpen = true;
    
    
          const modal = await this.modalCtrl.create({
     component:EstadoCuentaPage,
     cssClass:'alert-modal'
          });
    
    if(this.isOpen){
    
      modal.present();
      const {data} = await modal.onWillDismiss();
      this.isOpen = false;
      if(data != undefined){

        this.estadosCuentaService.syncGetEstadosCuentaToPromise().then(resp =>{
          this.estadosCuentaArray = resp;
          this.correoService.enviarCorreo(data.estado);
              }, error =>{
          this.alertasService.message('APP', 'Lo sentimos algo salio mal..')
          
              })


         
      }
    }
    

  }


  descargarArchivo(estado:estadosCuenta){
    this.estadosCuentaService.syncGetArchivoEstadosCuenta(estado.id).then(resp =>{

      console.log('resp')
    }, error =>{
      this.alertasService.message('APP', 'Lo sentimos algo salio mal..')
    })
  }
}
