import { Component, OnInit, ViewChild } from '@angular/core';
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
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-control-matriz-acceso',
  templateUrl: './control-matriz-acceso.page.html',
  styleUrls: ['./control-matriz-acceso.page.scss'],
})
export class ControlMatrizAccesoPage implements OnInit {
  isOpen:boolean = false;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  public columns: any;
  public rows: any[];
  temp = [];
  multi:any ='multi';
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
  ) {

this.cargarDatos();

   }
   editarElemento(row) {
    console.log(row,'editarElemento');
    let i = this.rows.findIndex( e => e.id == row.id);
    if(i >= 0){
      this.EditarMatrizAcceso(this.rows[i])
    }
  }
  borrarElemento(row) {
    let i = this.rows.findIndex( e => e.id == row.id);
    if(i >= 0){
      this.borrarMatrizAcceso(this.rows[i])
    }

    console.log(row,'borrarElemento');
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
    //d.nombre, d.descripcion, etc..
    console.log('d',d)
      return d.nombre.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  
  }
  cargarDatos(){

    this.columns = [
      { id: "iD_ONE_MATRIZ_ACCESO", label: "ID", size: 2},
      { id: "nombrE_COMPANIA", label: "Compañia", size: 2 },
      { id: "nombrE_DEPARTAMENTO", label: "Departamento", size: 4 },
      { id: "nombre", label: "Nombre", size: 2 },
      { id: "opciones", label: "Opciones", size: 2 }
  ];
  this.matrizAccesoService.syncGetMatrizAccesotoToPromise()
      .then((res) => {
        console.log(res)
        this.temp = [...res];

      // push our inital complete list
      this.rows = res;
      });
  }

  

  
  ngOnInit() {
   console.log(this.usuariosService.moduloAcceso, 'accesos')
    this.alertasService.presentaLoading('Cargando datos...')
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
  }

  
  async crearMatrizAcceso() {

 
    this.isOpen = true;

    const modal = await this.modalCtrl.create({
      component: CrearMatrizAccesoPage,
      cssClass: 'alert-modal',
      mode:'ios',
    });

    if (this.isOpen) {

      modal.present();
      const { data } = await modal.onWillDismiss();
      this.isOpen = false;
      if (data != undefined) {
     this.cargarDatos();

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
      mode:'ios',
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
        this.cargarDatos();


      }

    }
  }
  async borrarMatrizAcceso(acceso1:MatrizAccesoView) {
    const alert = await this.alertCrl.create({
      subHeader:'Dione',
      message:`¿Desea borrar el acceso  ${acceso1.nombre}?`,
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
  this.alertasService.presentaLoading('Borrando datos..');
  this.matrizAccesoService.syncDeleteMatrizAccesoToPromise(acceso1.iD_MATRIZ_ACCESO).then( resp =>{
    this.alertasService.loadingDissmiss();
    this.cargarDatos();

  }, error =>{
    console.log(error, acceso1)
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
