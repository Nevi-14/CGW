import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CrearUsuarioPage } from '../crear-usuario/crear-usuario.page';
import { EditarUsuarioPage } from '../editar-usuario/editar-usuario.page';
import { Usuarios } from 'src/app/models/usuarios';
import { UsuariosMatrizAccesoService } from 'src/app/services/usuarios-matriz-acceso.service';
import { MatrizAccesoService } from 'src/app/services/matriz-acceso.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
@Component({
  selector: 'app-control-usuarios',
  templateUrl: './control-usuarios.page.html',
  styleUrls: ['./control-usuarios.page.scss'],
})
export class ControlUsuariosPage implements OnInit {
  isOpen:boolean = false;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  public columns: any;
  public rows: any[];
  temp = [];
  multi:any ='multi';
  constructor(

public usuariosService:UsuariosService,
public alertasService:AlertasService,
public modalCtrl:ModalController,
public alertCrl: AlertController,
public usuarioMatrizAccesoService:UsuariosMatrizAccesoService,
public matrizAccesoService:MatrizAccesoService

  ) { 
this.cargarDatos();


  }


  editarElemento(row) {
    console.log(row,'editarElemento');
    let i = this.rows.findIndex( e => e.id == row.id);
    if(i >= 0){
      this.editarUsuario(this.rows[i])
    }
  }
  borrarElemento(row) {
    let i = this.rows.findIndex( e => e.id == row.id);
    if(i >= 0){
      this.borrarUsuario(this.rows[i])
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
      { id: "usuario", label: "Usuario", size: 2},
      { id: "nombre", label: "Nombre", size: 2 },
      { id: "correo", label: "Correo", size: 4 },
      { id: "fecha", label: "Fecha", size: 2 },
      { id: "opciones", label: "Opciones", size: 2 }
  ];
  this.usuariosService.syncGetUsuariosToPromise()
      .then((res) => {
        console.log(res)
        this.temp = [...res];

      // push our inital complete list
      this.rows = res;
      });
  }





  ngOnInit() {
 
  }


  async crearUsuario( ){
    this.isOpen = true;
        
          const modal = await this.modalCtrl.create({
     component:CrearUsuarioPage,
     cssClass:'alert-modal',
 
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

  async editarUsuario(usuario:Usuarios){

    let rolesArray = await this.usuarioMatrizAccesoService.syncGetUsuariosMatrizAccesoByIDtoToPromise(usuario.id); 
    console.log('rolesArray', rolesArray)
let roles = [];
if(rolesArray.length == 0){
  this.editaUsuario(usuario, roles)
}
rolesArray.forEach(async (role, index) =>{
  roles.push(role.iD_ONE_MATRIZ_ACCESO);
  if(index == rolesArray.length -1){
    console.log(roles)
 
this.editaUsuario(usuario,roles)
  }
})



    

  }

  async editaUsuario(usuario, roles){
  let matriz =  await this.matrizAccesoService.syncGetMatrizAccesotoToPromise(); 
    this.isOpen = true;
        
    const modal = await this.modalCtrl.create({
component:EditarUsuarioPage,
cssClass:'alert-modal',
componentProps:{
usuario,
roles,
matriz
}

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
  async borrarUsuario(usuario:Usuarios){
    const alert = await this.alertCrl.create({
      subHeader:'Dione',
      message:`¿Desea borrar el usuario ${usuario.nombre}?`,
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
  this.usuariosService.syncDeleteUsuarioToPromise(usuario.id).then( resp =>{
    this.alertasService.loadingDissmiss();
    this.cargarDatos();
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
