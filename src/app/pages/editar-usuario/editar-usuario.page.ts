import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UsuariosMatrizAcceso } from 'src/app/models/matrizAcceso';
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
export class EditarUsuarioPage {
  @Input() usuario: Usuarios;
  @Input() roles: any[] = [];
  @Input() matriz: any[] = [];
  multiple = true;
  constructor(
    public usuariosService: UsuariosService,
    public alertasService: AlertasService,
    public modalCtrl: ModalController,
    public matrizAccesoService: MatrizAccesoService,
    public usuariosMatrizAccesoService: UsuariosMatrizAccesoService
  ) {}

  async editarUsuario(form: NgForm) {
    let data = form.value;
    this.usuario.nombre = data.nombre;
    this.usuario.apellido = data.apellido;
    this.usuario.correo = data.correo;
    this.usuario.usuario = data.usuario;
    this.usuario.departamento = data.departamento;
    this.usuario.clave = data.clave;
    this.usuario.telefono = data.telefono;
    this.roles = data.roles;
    await this.usuariosMatrizAccesoService.syncDeleteUsuarioMatrizAccesoToPromise(
      this.usuario.id
    );
    this.alertasService.presentaLoading('guardando cambios..');
    this.usuariosService.syncPutUsuarioToPromise(this.usuario).then(
      (resp) => {
        this.usuariosService.syncGetUsuariosToPromise().then(
          (usuarios) => {
            this.usuariosService.usuarios = usuarios;
            if (!this.roles || this.roles.length == 0) {
              this.usuariosService.syncGetUsuariosToPromise().then(
                (usuarios) => {
                  this.usuariosService.usuarios = usuarios;
                  this.alertasService.loadingDissmiss();
                  this.modalCtrl.dismiss(true);
                  this.alertasService.message('D1', 'usuario Editado');
                },
                (error) => {
                  this.alertasService.loadingDissmiss();
                }
              );
            }
            this.roles.forEach(async (role, index) => {
              let rod: UsuariosMatrizAcceso = {
                id: null,
                iD_ONE_MATRIZ_ACCESO: role,
                iD_USUARIO: this.usuario.id,
              };
              await this.usuariosMatrizAccesoService.syncPostUsuarioMatrizAccesoToPromise(
                rod
              );
              if (index == this.roles.length - 1) {
                this.usuariosService.syncGetUsuariosToPromise().then(
                  (usuarios) => {
                    this.usuariosService.usuarios = usuarios;
                    this.alertasService.loadingDissmiss();
                    this.modalCtrl.dismiss(true);
                    this.alertasService.message('D1', 'usuario Editado');
                  },
                  (error) => {
                    this.alertasService.loadingDissmiss();
                  }
                );
              }
            });
          },
          (error) => {
            this.alertasService.loadingDissmiss();
          }
        );
      },
      (error) => {
        this.alertasService.loadingDissmiss();
      }
    );
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }
}
