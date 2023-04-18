import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MatrizAcceso } from 'src/app/models/matrizAcceso';
import { MatrizAccesoView } from 'src/app/models/matrizAccesoView';
import { AlertasService } from 'src/app/services/alertas.service';
import { CompaniasService } from 'src/app/services/companias.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { MatrizAccesoService } from 'src/app/services/matriz-acceso.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { RolesService } from 'src/app/services/roles.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-editar-matriz-acceso',
  templateUrl: './editar-matriz-acceso.page.html',
  styleUrls: ['./editar-matriz-acceso.page.scss'],
})
export class EditarMatrizAccesoPage implements OnInit {
  @Input() acceso: MatrizAcceso
  usuarios:MatrizAccesoView[]=[]
  constructor(
    public modalCtrl: ModalController,
    public modulosService: ModulosService,
    public companiaService: CompaniasService,
    public departamentosService: DepartamentosService,
    public rolesService: RolesService,
    public alertasService: AlertasService,
    public usuariosService: UsuariosService,
    public matrizAccesoService:MatrizAccesoService,
    public cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    console.log(this.acceso)
    this.matrizAccesoService.syncGetUsuariosMatrizAccesoIDtoToPromise(this.acceso.id).then(usuarios =>{
 
this.usuarios = usuarios;
    }, error =>{
       
      this.alertasService.message('Dione','Lo sentimos algo salio mal..');
    })
  }

  cerrarModal() {
    this.modalCtrl.dismiss();

  }

  generarPost(){
    this.alertasService.presentaLoading('Guardando cambios..');
    this.matrizAccesoService.syncPutMatrizAccesoToPromise(this.acceso).then(resp =>{
      this.alertasService.loadingDissmiss();
      this.matrizAccesoService.syncGetMatrizAccesotoToPromise().then(accesos =>{
        this.matrizAccesoService.matrizAcceso = accesos;
        this.modalCtrl.dismiss();
        this.alertasService.message('Dione','Acceso actualizado');
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
