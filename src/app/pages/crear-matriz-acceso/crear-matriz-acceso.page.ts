import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MatrizAcceso } from 'src/app/models/matrizAcceso';
import { Usuarios } from 'src/app/models/usuarios';
import { AlertasService } from 'src/app/services/alertas.service';
import { CompaniasService } from 'src/app/services/companias.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { MatrizAccesoService } from 'src/app/services/matriz-acceso.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Modulos } from '../../models/modulos';
import { ModulosMatrizAccesoService } from 'src/app/services/modulos-matriz-acceso.service';

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
   nombre: null,
   estatus: true,
   aprobador: false,
   c: false,
   r: true,
   u: false,
   d: false
}

modulos= []
  constructor(
    public modalCtrl: ModalController,
    public modulosService: ModulosService,
    public companiaService: CompaniasService,
    public departamentosService: DepartamentosService,
    public alertasService: AlertasService,
    public usuariosService: UsuariosService,
    public matrizAccesoService:MatrizAccesoService,
    public modulosMatrizccesoService:ModulosMatrizAccesoService
  ) { }

  ngOnInit() {
    this.alertasService.presentaLoading('Cargando datos..');
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

  cerrarModal() {
    this.modalCtrl.dismiss();

  }


  generarPost(){
    console.log(this.acceso, 'acceso')
console.log('modulos', this.modulos)
   

    this.alertasService.presentaLoading('Guardando cambios..');
    this.matrizAccesoService.syncPostMatrizAccesoToPromise(this.acceso).then( (resp:MatrizAcceso) =>{

      
    this.modulos.forEach(async (modulo, index) =>{
      let mod = {
         id:null,
         iD_MATRIZ_ACCESO: resp.id,
         iD_MODULO: modulo
      }
      console.log(mod)
     await  this.modulosMatrizccesoService.syncPostModuloMatrizAccesoToPromise(mod);
      if(index == this.modulos.length -1){
        this.alertasService.loadingDissmiss();
        this.alertasService.message('Dione', 'Role Creado')
        this.modalCtrl.dismiss(true)
      }
    })


    }, error =>{
      this.alertasService.loadingDissmiss();
      this.alertasService.message('Dione', 'Lo sentimos algo salio mal..')
    })
  
  }
}
