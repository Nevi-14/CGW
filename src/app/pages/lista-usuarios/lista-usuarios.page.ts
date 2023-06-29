import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UsuarioExactus } from 'src/app/models/usuarios';
import { AlertasService } from 'src/app/services/alertas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.page.html',
  styleUrls: ['./lista-usuarios.page.scss'],
})
export class ListaUsuariosPage implements OnInit {
  usuarios: UsuarioExactus[] = []
  usuariosAnticipo=[]
  textoBuscar = '';
  constructor(
public usuariosService: UsuariosService,
public alertasService:AlertasService,
public modalCtrl:ModalController

  ) { }

  ngOnInit() {
    this.alertasService.presentaLoading('Cargando datos...');
    this.usuariosService.syncGetUsuariosExactusToPromise().then(resp => {
      this.alertasService.loadingDissmiss();
      this.usuarios = resp;
    }, error => {
      this.alertasService.loadingDissmiss();
      this.alertasService.message('APP', 'Lo sentimos algo salio mal..')
    })
  }
  agregarUsuario($event, usuario: UsuarioExactus) {
    let u = this.usuarios.findIndex(e => e.usuario == usuario.usuario)
    let i = this.usuariosAnticipo.findIndex(k => k.usuario == this.usuarios[u].usuario);
    const isChecked = $event.detail.checked;
    console.log('isChecked', isChecked)
    if (isChecked) {
      this.usuariosAnticipo.push(this.usuarios[u]);
    } else {
 
      if (i >= 0) {
        this.usuariosAnticipo.splice(i, 1);
      }
    }

    console.log('This.usuariosAnticipo', this.usuariosAnticipo)


  }


  cerrarModal(){
    this.modalCtrl.dismiss();
  }
  onSearchChange(event){
    this.textoBuscar = event.detail.value;
  }
  retornarUsuarios(){
    this.modalCtrl.dismiss(this.usuariosAnticipo);
  }
}
