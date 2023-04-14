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
import { RolesService } from 'src/app/services/roles.service';
import { MatrizAccesoView } from 'src/app/models/matrizAccesoView';

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
  public rolesService:RolesService,
  public alertCrl: AlertController
  ) { }

  ngOnInit() {
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
            this.rolesService.syncGetRolesToPromise().then(roles => {
              this.rolesService.roles = roles;
              this.alertasService.loadingDissmiss();
              console.log('modulos', this.modulosService.modulos);
              console.log('companias', this.companiaService.companias)
              console.log('departamentos', this.departamentosService.departamentos);
              console.log('roles', this.rolesService.roles);
          //    console.log('usuarios', this.usuariosService.usuarios);
              //this.cd.detectChanges();
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
   

      }

    }
  }
  async EditarMatrizAcceso(acceso1:MatrizAccesoView) {
let acceso = await this.matrizAccesoService.syncGetMatrizAccesoByIDtoToPromise(acceso1.id);  
 console.log(acceso)
    this.isOpen = true;

    const modal = await this.modalCtrl.create({
      component: EditarMatrizAccesoPage,
      cssClass: 'alert-modal',
      componentProps:{
        acceso : acceso[0]
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
    let acceso = await this.matrizAccesoService.syncGetMatrizAccesoByIDtoToPromise(acceso1.id);  
    const alert = await this.alertCrl.create({
      subHeader:'Dione',
      message:`¿Desea borrar el acceso # ${acceso[0].id}?`,
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
  this.matrizAccesoService.syncDeleteMatrizAccesoToPromise(acceso[0].id).then( resp =>{
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
