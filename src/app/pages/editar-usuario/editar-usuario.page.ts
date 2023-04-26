import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UsuariosMatrizAcceso } from 'src/app/models/matrizAcceso';
import { MatrizAccesoView } from 'src/app/models/matrizAccesoView';
import { Usuarios } from 'src/app/models/usuarios';
import { AlertasService } from 'src/app/services/alertas.service';
import { MatrizAccesoService } from 'src/app/services/matriz-acceso.service';
import { UsuariosMatrizAccesoService } from 'src/app/services/usuarios-matriz-acceso.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.page.html',
  styleUrls: ['./editar-usuario.page.scss'],
})
export class EditarUsuarioPage implements OnInit {
@Input() usuario:Usuarios
@Input()roles:[] = [];
@Input()matriz:MatrizAccesoView[] = [];
  constructor(
public usuariosService:UsuariosService,
public alertasService:AlertasService,
public modalCtrl:ModalController,
public matrizAccesoService: MatrizAccesoService,
public usuariosMatrizAccesoService: UsuariosMatrizAccesoService

  ) { }

 async ngOnInit() {
 

  console.log('roles', this.roles)
  }


 async post(){
    console.log(this.usuario)
await this.usuariosMatrizAccesoService.syncDeleteUsuarioMatrizAccesoToPromise(this.usuario.id);
    this.alertasService.presentaLoading('guardando cambios..')
    this.usuariosService.syncPutUsuarioToPromise(this.usuario).then(resp =>{
   this.usuariosService.syncGetUsuariosToPromise().then(usuarios =>{
    this.usuariosService.usuarios = usuarios;
    if(this.roles.length == 0){
      this.usuariosService.syncGetUsuariosToPromise().then(usuarios =>{
        this.usuariosService.usuarios = usuarios;
        this.alertasService.loadingDissmiss();
        this.modalCtrl.dismiss();
        this.alertasService.message('Dione', 'usuario Editado')
        }, error =>{
          this.alertasService.loadingDissmiss();
        })
    }
    this.roles.forEach(async (role, index) =>{
      let rod:UsuariosMatrizAcceso = {
        id:null,
        iD_ONE_MATRIZ_ACCESO: role,
        iD_USUARIO: this.usuario.id
     }
      console.log(rod)
     await  this.usuariosMatrizAccesoService.syncPostUsuarioMatrizAccesoToPromise(rod);
      if(index == this.roles.length -1){
 
        this.usuariosService.syncGetUsuariosToPromise().then(usuarios =>{
          this.usuariosService.usuarios = usuarios;
          this.alertasService.loadingDissmiss();
          this.modalCtrl.dismiss();
          this.alertasService.message('Dione', 'usuario Editado')
          }, error =>{
            this.alertasService.loadingDissmiss();
          })

      }
    })
   }, error =>{
    this.alertasService.loadingDissmiss();
  })
    }, error =>{
      this.alertasService.loadingDissmiss();
    })
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

}
