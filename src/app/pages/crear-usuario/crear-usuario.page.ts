import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UsuariosMatrizAcceso } from 'src/app/models/matrizAcceso';
import { Usuarios } from 'src/app/models/usuarios';
import { AlertasService } from 'src/app/services/alertas.service';
import { MatrizAccesoService } from 'src/app/services/matriz-acceso.service';
import { UsuariosMatrizAccesoService } from 'src/app/services/usuarios-matriz-acceso.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
interface data {
  id:any,
  valor:any, 
 }
@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.page.html',
  styleUrls: ['./crear-usuario.page.scss'],
})
export class CrearUsuarioPage implements OnInit {

  usuario:Usuarios  = {
    id : null,
      usuario:null,
       nombre:null,
       apellido:null,
      clave: null,
      correo:null,
      estatus:true,
      fecha:new Date(),
      seleccionado:null
    
  }
  roles = [];
  matriz = [];
  multiple:boolean = true;
  constructor(
public usuariosService:UsuariosService,
public alertasService:AlertasService,
public modalCtrl:ModalController,
public matrizAccesoService:MatrizAccesoService,
public usuariosMatrizAccesoService:UsuariosMatrizAccesoService

  ) { }

 async  ngOnInit() {
let matriz =  await this.matrizAccesoService.syncGetMatrizAccesotoToPromise();
this.matriz = await this.retornarArreglo(matriz,'iD_MATRIZ_ACCESO','nombre');
   console.log(this.matriz)

  }
  async retornarArreglo(array:any[],id:string,valor:string){
    let data:data[] = [];
     array.forEach((element, index) => {  
      console.log(element)
       let item = {
         id : element[id],
         valor: element[valor]
        };
         data.push(item) 

         if(index == array.length -1){
           return data;
         }
     });

     return data
 }


 crearUsuario(form:NgForm){
let data = form.value;
console.log(data,'data') 
this.usuario.nombre = data.nombre;
this.usuario.apellido = data.apellido;
this.usuario.correo = data.correo;
this.usuario.usuario = data.usuario;
this.usuario.clave = data.clave;
this.roles = data.roles
    if(this.roles.length == 0){
      this.alertasService.message('Dione', 'Seleciona un rol para continuar!.')
      return
    }
    console.log(this.usuario)
    this.alertasService.presentaLoading('guardando cambios..')
    this.usuariosService.syncPostUsuarioToPromise(this.usuario).then((resp:Usuarios) =>{

          console.log('post user',resp)
          console.log('post roles',this.roles)
      this.roles.forEach(async (role, index) =>{
        let rod:UsuariosMatrizAcceso = {
          id:null,
          iD_ONE_MATRIZ_ACCESO: role,
          iD_USUARIO: resp.id
       }
        console.log(rod)
       await  this.usuariosMatrizAccesoService.syncPostUsuarioMatrizAccesoToPromise(rod);
        if(index == this.roles.length -1){
       
 
            this.alertasService.loadingDissmiss();
            this.modalCtrl.dismiss(true);
            this.alertasService.message('Dione', 'usuario Creado')
      


  
        }
      })

 

    
    }, error =>{
      console.log(error)
      this.alertasService.loadingDissmiss();
      this.alertasService.message('Dione', 'Lo sentimos algo salio mal')
    })
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }
}
