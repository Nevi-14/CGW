import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { UsuarioExactus } from 'src/app/models/usuarios';
import { AlertasService } from 'src/app/services/alertas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.page.html',
  styleUrls: ['./lista-usuarios.page.scss'],
})
export class ListaUsuariosPage implements OnInit {
  @Input() Cod_Compania: string;
  listaUsuarios: UsuarioExactus[] = []
  usuarios: UsuarioExactus[] = []
  usuariosAnticipo=[]
  textoBuscar = '';
  totalUsuarios = 0;
  constructor(
public usuariosService: UsuariosService,
public alertasService:AlertasService,
public modalCtrl:ModalController,
public alertCtrl:AlertController

  ) { }

  ngOnInit() {
    this.alertasService.presentaLoading('Cargando datos...');
    this.usuariosService.syncGetUsuariosExactusToPromise(this.Cod_Compania).then(resp => {
      this.alertasService.loadingDissmiss();
      this.listaUsuarios = resp;
      this.usuarios = resp;
    }, error => {
      this.alertasService.loadingDissmiss();
      this.alertasService.message('APP', 'Lo sentimos algo salio mal..')
    })
  }
  agregarUsuario($event, usuario: UsuarioExactus) {
    if(this.listaUsuarios.length < this.usuarios.length){
 this.listaUsuarios =       this.usuarios;
    }
  
    let u = this.usuarios.findIndex(e => e.usuario == usuario.usuario)
    let i = this.usuariosAnticipo.findIndex(k => k.usuario == this.usuarios[u].usuario);
    const isChecked = $event.detail.checked;
    console.log('isChecked', isChecked)
    if (isChecked) {
      if (i < 0) {
        this.totalUsuarios += 1;
        this.usuariosAnticipo.push(this.usuarios[u]);
      }
    } else {
 
      if (i >= 0) {
        this.totalUsuarios -= 1;
        this.usuariosAnticipo.splice(i, 1);
      }
    }

    console.log('This.usuariosAnticipo', this.usuariosAnticipo)


  }

  async filtroUsuarios() {
    const alert = await this.alertCtrl.create({
      header: 'D1',
      subHeader:'Filtrar Lista de Usuarios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
 
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: (data) => {
            switch(data){
              case true: 

              this.usuarios = this.listaUsuarios.filter( e => e.seleccionado == true);
              break;

              case false :
              
                this.usuarios = this.listaUsuarios.filter( e => e.seleccionado != true);
              break;
              case null :
                this.usuarios = this.listaUsuarios;
              break;
            }
          },
        },
      ],
      mode:'ios',
      inputs: [
        {
          label: 'Usuarios Seleccionados',
          type: 'radio',
          value: true,
        },
        {
          label: 'Usuarios Pendientes',
          type: 'radio',
          value: false,
        },
        {
          label: 'Todos los Usuarios',
          type: 'radio',
          value: null,
        },
      ],
    });

    await alert.present();
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
