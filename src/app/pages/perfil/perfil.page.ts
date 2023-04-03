import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  constructor(
public modalCtrl: ModalController,
public usuariosService: UsuariosService

  ) { }

  ngOnInit() {
    console.log('usuariosService', this.usuariosService.usuario)
  }
  cerrarModal(){

this.modalCtrl.dismiss();
  }
}
