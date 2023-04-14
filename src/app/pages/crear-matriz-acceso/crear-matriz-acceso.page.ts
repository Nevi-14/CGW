import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MatrizAcceso } from 'src/app/models/matrizAcceso';
import { AlertasService } from 'src/app/services/alertas.service';
import { CompaniasService } from 'src/app/services/companias.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { MatrizAccesoService } from 'src/app/services/matriz-acceso.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { RolesService } from 'src/app/services/roles.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-crear-matriz-acceso',
  templateUrl: './crear-matriz-acceso.page.html',
  styleUrls: ['./crear-matriz-acceso.page.scss'],
})
export class CrearMatrizAccesoPage implements OnInit {
acceso:MatrizAcceso = {
   id:null,
   iD_COMPANIA: null,
   iD_DEPARTAMENTO: null,
   iD_MODULO: null,
   iD_ROLE: null,
   iD_USUARIO: null,
   estatus: true,
   administrador: false,
   aprobador: false,
   c: false,
   r: false,
   u: false,
   d: false
}
  constructor(
    public modalCtrl: ModalController,
    public modulosService: ModulosService,
    public companiaService: CompaniasService,
    public departamentosService: DepartamentosService,
    public rolesService: RolesService,
    public alertasService: AlertasService,
    public usuariosService: UsuariosService,
    public matrizAccesoService:MatrizAccesoService
  ) { }

  ngOnInit() {
    this.alertasService.presentaLoading('Cargando datos..');
    this.modulosService.syncGetModulosToPromise().then(modulos => {
      this.modulosService.modulos = modulos;
      this.companiaService.syncGetCompaniasToPromise().then(companias => {
        this.companiaService.companias = companias;
        this.departamentosService.syncGetDepartamentoToPromise().then(departamentos => {
          this.departamentosService.departamentos = departamentos;
          this.rolesService.syncGetRolesToPromise().then(roles => {
            this.rolesService.roles = roles;
            this.usuariosService.syncGetUsuariosToPromise().then(usuarios => {
              this.usuariosService.usuarios = usuarios;
              this.alertasService.loadingDissmiss();
              console.log('modulos', this.modulosService.modulos);
              console.log('companias', this.companiaService.companias)
              console.log('departamentos', this.departamentosService.departamentos);
              console.log('roles', this.rolesService.roles);
              console.log('usuarios', this.usuariosService.usuarios);
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
    }, error => {
      this.alertasService.loadingDissmiss();
      this.alertasService.message('Dione', 'Lo sentimos algo salio mal..')
    })
  }

  cerrarModal() {
    this.modalCtrl.dismiss();

  }
  generarPost(){
    console.log('acceso', this.acceso)
    this.alertasService.presentaLoading('Guardando cambios..');
    this.matrizAccesoService.syncPostMatrizAccesoToPromise(this.acceso).then(resp =>{
this.matrizAccesoService.syncGetMatrizAccesotoToPromise().then(accesos =>{
this.matrizAccesoService.matrizAcceso = accesos;
this.alertasService.loadingDissmiss();
this.modalCtrl.dismiss();
this.alertasService.message('Dione', 'Acceso creado!.')
}, error =>{
  this.alertasService.loadingDissmiss();
  this.alertasService.message('Dione', 'Lo sentimos algo salio mal..')
})
    }, error =>{
      this.alertasService.loadingDissmiss();
      this.alertasService.message('Dione', 'Lo sentimos algo salio mal..')
    })
  
  }
}
