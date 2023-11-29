import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MatrizAcceso, MatrizAccesoModulos } from 'src/app/models/matrizAcceso';
import { AlertasService } from 'src/app/services/alertas.service';
import { CompaniasService } from 'src/app/services/companias.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { MatrizAccesoService } from 'src/app/services/matriz-acceso.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ModulosMatrizAccesoService } from 'src/app/services/modulos-matriz-acceso.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Modulos } from 'src/app/models/modulos';
@Component({
  selector: 'app-crear-matriz-acceso',
  templateUrl: './crear-matriz-acceso.page.html',
  styleUrls: ['./crear-matriz-acceso.page.scss'],
})
export class CrearMatrizAccesoPage implements OnInit {
  form: FormGroup;
  acceso: MatrizAcceso = {
    id: null,
    nombre: null,
    estatus: true,
    c: false,
    r: true,
    u: false,
    d: false,
  };
 
  modulos: Modulos[] = [];
  constructor(
    public modalCtrl: ModalController,
    public modulosService: ModulosService,
    public companiaService: CompaniasService,
    public departamentosService: DepartamentosService,
    public alertasService: AlertasService,
    public usuariosService: UsuariosService,
    public matrizAccesoService: MatrizAccesoService,
    public modulosMatrizccesoService: ModulosMatrizAccesoService,
    private fb: FormBuilder
  ) {}
  ngOnInit() {
    this.form = this.fb.group({
      nombre: [this.acceso.nombre, [Validators.required,Validators.minLength(6)]],
			rol: [this.acceso.id, [Validators.required]]
    });

    this.alertasService.presentaLoading('Cargando datos..');
    this.modulosService.syncGetModulosToPromise().then(
      async (modulos) => {
        this.modulos = this.modulos.concat(modulos);
        this.companiaService.syncGetCompaniasToPromise().then(
          async (companias) => {
            this.alertasService.loadingDissmiss();
          },
          (error) => {
            this.alertasService.loadingDissmiss();
            this.alertasService.message('D1', 'Lo sentimos algo salio mal..');
          }
        );
      },
      (error) => {
        this.alertasService.loadingDissmiss();
        this.alertasService.message('D1', 'Lo sentimos algo salio mal..');
      }
    );
  }
  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  crearRolAcceso() {
 
    this.alertasService.presentaLoading('Guardando cambios..');
    this.matrizAccesoService.syncPostMatrizAccesoToPromise(this.acceso).then(
      (resp: MatrizAcceso) => {
        this.modulos.forEach(async (modulo, index) => {
          let mod: MatrizAccesoModulos = {
            id: null,
            iD_MATRIZ_ACCESO: resp.id,
            iD_MODULO: modulo.id,
          };
          if (modulo.seleccionado)
            await this.modulosMatrizccesoService.syncPostModuloMatrizAccesoToPromise(
              mod
            );
          if (index == this.modulos.length - 1) {
            this.alertasService.loadingDissmiss();
            this.alertasService.message('D1', 'Role Creado');
            this.modalCtrl.dismiss(true);
          }
        });
      },
      (error) => {
        this.alertasService.loadingDissmiss();
        this.alertasService.message('D1', 'Lo sentimos algo salio mal..');
      }
    );
  }
}
