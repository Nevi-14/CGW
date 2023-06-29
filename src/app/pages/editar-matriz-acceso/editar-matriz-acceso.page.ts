import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OneUsuariosModulosMatrizAccesoView } from 'src/app/models/OneUsuariosModulosMatrizAccesoView';
import { MatrizAcceso } from 'src/app/models/matrizAcceso';
import { AlertasService } from 'src/app/services/alertas.service';
import { CompaniasService } from 'src/app/services/companias.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { MatrizAccesoService } from 'src/app/services/matriz-acceso.service';
import { ModulosMatrizAccesoService } from 'src/app/services/modulos-matriz-acceso.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-editar-matriz-acceso',
  templateUrl: './editar-matriz-acceso.page.html',
  styleUrls: ['./editar-matriz-acceso.page.scss'],
})
export class EditarMatrizAccesoPage implements OnInit {
  @Input() acceso: MatrizAcceso
  @Input() modulos:[]=[]
  total = 0;
  usuarios:OneUsuariosModulosMatrizAccesoView[]=[]
  constructor(
    public modalCtrl: ModalController,
    public modulosService: ModulosService,
    public companiaService: CompaniasService,
    public departamentosService: DepartamentosService,
    public alertasService: AlertasService,
    public usuariosService: UsuariosService,
    public matrizAccesoService:MatrizAccesoService,
    public cd: ChangeDetectorRef,
    public modulosMatrizccesoService:ModulosMatrizAccesoService
  ) { }

  ngOnInit() {
    this.total = this.modulos.length;
    console.log(this.acceso, 'acceso')
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
  borrarModulo($event){
    console.log($event)
      }
 async  generarPost(){

  await this.modulosMatrizccesoService.syncDeleteModuloMatrizAccesoToPromise(this.acceso.id);

    this.alertasService.presentaLoading('Guardando cambios..');
    this.matrizAccesoService.syncPutMatrizAccesoToPromise(this.acceso).then(resp =>{
      this.alertasService.loadingDissmiss();
      this.matrizAccesoService.syncGetMatrizAccesotoToPromise().then(accesos =>{
        this.matrizAccesoService.matrizAcceso = accesos;
        if(this.modulos.length == 0){
          this.alertasService.message('Dione','Acceso actualizado');    
          this.modalCtrl.dismiss(true)
          
        }

        this.modulos.forEach(async (modulo, index) =>{
          let mod = {
             id:null,
             iD_MATRIZ_ACCESO: this.acceso.id,
             iD_MODULO: modulo
          }
          console.log(mod)
         await  this.modulosMatrizccesoService.syncPostModuloMatrizAccesoToPromise(mod);
          if(index == this.modulos.length -1){
            this.alertasService.message('Dione','Acceso actualizado');    
            this.modalCtrl.dismiss(true)
          }
        })


      }, error =>{
        this.alertasService.loadingDissmiss();
        this.alertasService.message('Dione','Lo sentimos algo salio mal..');
      })
    }, error =>{
      this.alertasService.loadingDissmiss();
      this.alertasService.message('Dione','Lo sentimos algo salio mal..');
    })
  }

}
