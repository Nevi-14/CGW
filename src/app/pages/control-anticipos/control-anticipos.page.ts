import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { adelantoViaticos } from 'src/app/models/adelantoViaticos';
import { AdelantoViaticosService } from 'src/app/services/adelanto-viaticos.service';
import { AlertasService } from '../../services/alertas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-control-anticipos',
  templateUrl: './control-anticipos.page.html',
  styleUrls: ['./control-anticipos.page.scss'],
})
export class ControlAnticiposPage implements OnInit {
  isOpen: boolean = false;
  adelantoViaticosArray:adelantoViaticos[]=[];
  textoBuscar = "";
  constructor(
public modalCtrl: ModalController,
public adelantoViaticosService:AdelantoViaticosService,
public alertasService: AlertasService,
public router:Router


  ) { }
  

  ngOnInit() {
    this.adelantoViaticosService.adelantoViatico  = null;
    this.cargarDatos();
  }
  onSearchChange(event){

    this.textoBuscar = event.detail.value;
      }
  async cargarDatos(){
this.alertasService.presentaLoading('Cargando datos...');
this.adelantoViaticosService.syncGetAdelantoViaticosToPromise().then(resp =>{
 this.alertasService.loadingDissmiss();
  this.adelantoViaticosArray = resp;

}, error =>{
  this.alertasService.loadingDissmiss();
  this.alertasService.message('DIONE', 'Lo sentimos algo salio mal..')
})

  }

  correo(){
    this.alertasService.message('DIONE', 'La opción no se encuentra disponible..')
  }
  async adelantoViaticos(){

    this.router.navigateByUrl('/inicio/registro-anticipos', {replaceUrl:true});

  
    

  }

  async detalleAdeltanto(adelanto:adelantoViaticos){
    this.adelantoViaticosService.adelantoViatico = adelanto;
    this.router.navigateByUrl('inicio/detalle-anticipo')
  }
}
