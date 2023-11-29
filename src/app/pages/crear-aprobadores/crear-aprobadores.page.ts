import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Usuarios } from 'src/app/models/usuarios';
import { AlertasService } from 'src/app/services/alertas.service';
import { AprobadoresService } from 'src/app/services/aprobadores.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-crear-aprobadores',
  templateUrl: './crear-aprobadores.page.html',
  styleUrls: ['./crear-aprobadores.page.scss'],
})
export class CrearAprobadoresPage implements OnInit {
role = '01';
compania = 'CVET';
roles = [
  {
    id:'01',
    nombre:'Aprobador Solicitudes'
  },
  {
    id:'02',
    nombre:'Aprobador Anticipo'
  },
  {
    id:'03',
    nombre:'Ambos Roles'
  }
]
companias = [
  {
    id:'CVET',
    nombre:'CVET'
  },
  {
    id:'COOK',
    nombre:'COOK'
  },
  {
    id:'CRCB',
    nombre:'CRCB'
  },
  {
    id:'TODAS',
    nombre:'TODAS'
  },
    

]
textoBuscar = '';
usuarios:Usuarios[] = [];
temp = [];
  constructor(
 public modalCtrl:ModalController,
 public usuariosService:UsuariosService,
 public alertasService:AlertasService,
 public aprobadoresService:AprobadoresService   
  ) { }

  ngOnInit() {
   this.cargarDatos()
  }
  regresar(){
    this.modalCtrl.dismiss();
  }
  
  cargarDatos(){
    this.usuariosService.syncGetUsuariosToPromise()
        .then((res) => {
          console.log(res)
          this.temp = [...res];
        this.usuarios = res;
        });
    }

    generarPost(){
     let  usuarios =  this.usuarios.filter( e => e.seleccionado == true);
     if(usuarios.length ==  0){
       return  this.alertasService.message('D1','Debes de seleccionar al menos un usuario');
    }
    this.alertasService.presentaLoading('Generando registros...')
    usuarios.forEach(async (element, index) => {
      let data = {
        usuario:element.usuario,
        role:this.role,
        coD_COMPANIA:this.compania
      }
     await this.aprobadoresService.syncPostAprobadorToPromise(data).then((res)=>{

      if(index  == usuarios.length -1){
        this.alertasService.loadingDissmiss();
        this.modalCtrl.dismiss(true);
        this.alertasService.message('D1','Registros generados correctamente');
        console.log('ultimo')
      }

     },error =>{
        this.alertasService.loadingDissmiss();
      return  this.alertasService.message('D1','Error generando registros');
         
     })
    
    })
  }
  onSearchChange(event){
    this.textoBuscar = event.detail.value;
   }
}
