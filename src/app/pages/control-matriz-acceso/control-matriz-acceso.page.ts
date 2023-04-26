import { Component, OnInit } from '@angular/core';
import { CrearMatrizAccesoPage } from '../crear-matriz-acceso/crear-matriz-acceso.page';
import { AlertController, ModalController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import { MatrizAccesoService } from 'src/app/services/matriz-acceso.service';
import { MatrizAcceso } from 'src/app/models/matrizAcceso';
import { EditarMatrizAccesoPage } from '../editar-matriz-acceso/editar-matriz-acceso.page';
import { ModulosService } from 'src/app/services/modulos.service';
import { CompaniasService } from 'src/app/services/companias.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { OneUsuariosModulosMatrizAccesoView } from 'src/app/models/OneUsuariosModulosMatrizAccesoView';
import { MatrizAccesoView } from 'src/app/models/matrizAccesoView';
import { ModulosMatrizAccesoService } from 'src/app/services/modulos-matriz-acceso.service';

@Component({
  selector: 'app-control-matriz-acceso',
  templateUrl: './control-matriz-acceso.page.html',
  styleUrls: ['./control-matriz-acceso.page.scss'],
})
export class ControlMatrizAccesoPage implements OnInit {
  isOpen:boolean = false;
  constructor(
  public modalCtrl: ModalController,
  public alertasService:AlertasService,
  public matrizAccesoService:MatrizAccesoService,
  public modulosService: ModulosService  ,
  public companiaService: CompaniasService,
  public departamentosService: DepartamentosService,
  public alertCrl: AlertController,
  public usuariosService:UsuariosService,
  public modulosMatrizAccesoService:ModulosMatrizAccesoService
  ) { }

  ngOnInit() {
   console.log(this.usuariosService.moduloAcceso, 'accesos')
    this.alertasService.presentaLoading('Cargando datos...')
    this.matrizAccesoService.syncGetMatrizAccesotoToPromise().then(accesos =>{
//
      this.matrizAccesoService.matrizAcceso = accesos;

   //   this.alertasService.presentaLoading('Cargando datos..');
      this.modulosService.syncGetModulosToPromise().then(modulos => {
        this.modulosService.modulos = modulos;
        this.companiaService.syncGetCompaniasToPromise().then(companias => {
          this.companiaService.companias = companias;
          this.departamentosService.syncGetDepartamentoToPromise().then(departamentos => {
            this.departamentosService.departamentos = departamentos;
            this.alertasService.loadingDissmiss();
            console.log('modulos', this.modulosService.modulos);
            console.log('companias', this.companiaService.companias)
            console.log('departamentos', this.departamentosService.departamentos);
      
  
          }, error => {
            this.alertasService.loadingDissmiss();
            this.alertasService.message('Dione', 'Lo sentimos algo salio mal..')
          })
        }, error => {
          this.alertasService.loadingDissmiss();
          this.alertasService.message('Dione', 'Lo sentimos algo salio mal..')
        })
      }, error => {
        this.alertasService.loadingDissmiss();
        this.alertasService.message('Dione', 'Lo sentimos algo salio mal..')
      })
    }, error =>{
      this.alertasService.loadingDissmiss();
      this.alertasService.message('Dione','Lo sentimos algo salio mal!..')
    })
  }
  async crearMatrizAcceso() {

 
    this.isOpen = true;

    const modal = await this.modalCtrl.create({
      component: CrearMatrizAccesoPage,
      cssClass: 'alert-modal'
    });

    if (this.isOpen) {

      modal.present();
      const { data } = await modal.onWillDismiss();
      this.isOpen = false;
      if (data != undefined) {
        this.matrizAccesoService.syncGetMatrizAccesotoToPromise().then(accesos =>{
          //
                this.matrizAccesoService.matrizAcceso = accesos;

        }, error =>{
          console.log(error)
        })

      }

    }
  }


  async EditarMatrizAcceso(acceso1:MatrizAccesoView) {
    console.log(acceso1, '1')
let acceso = await this.matrizAccesoService.syncGetMatrizAccesoIDtoToPromise(acceso1.iD_MATRIZ_ACCESO); 
let modulosArray = await this.modulosMatrizAccesoService.syncGetModulosMatrizAccesoByIDtoToPromise(acceso1.iD_MATRIZ_ACCESO); 
let modulos = [];
if(modulosArray.length == 0){
  this.editarMatriz(modulos,acceso[0])
}
modulosArray.forEach(async (modulo, index) =>{
  modulos.push(modulo.iD_MODULO);
  if(index == modulosArray.length -1){
    console.log(modulosArray)
    console.log(acceso, 'to edit')
this.editarMatriz(modulos,acceso[0])
  }
})

  }

  async editarMatriz(modulos, acceso){
    this.isOpen = true;
   
    const modal = await this.modalCtrl.create({
      component: EditarMatrizAccesoPage,
      cssClass: 'alert-modal',
      componentProps:{
        acceso,
        modulos
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
  async borrarMatrizAcceso(acceso1:MatrizAccesoView) {
    const alert = await this.alertCrl.create({
      subHeader:'Dione',
      message:`¿Desea borrar el acceso # ${acceso1.nombre}?`,
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
  this.alertasService.presentaLoading('Borrando datos..');
  this.matrizAccesoService.syncDeleteMatrizAccesoToPromise(acceso1.iD_MATRIZ_ACCESO).then( resp =>{
    this.alertasService.loadingDissmiss();
    this.matrizAccesoService.syncGetMatrizAccesotoToPromise().then(accesos =>{
      this.matrizAccesoService.matrizAcceso = accesos;
    }, error =>{
      this.alertasService.loadingDissmiss();
      this.alertasService.message('Dione','Lo sentimos algo salio mal...')
    })
  }, error =>{
    this.alertasService.loadingDissmiss();
    this.alertasService.message('Dione','Lo sentimos algo salio mal...')
  })
          }
        }
      ]
    })
    alert.present();
  
    }

}
