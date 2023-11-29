import { Component, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { MatrizAcceso } from 'src/app/models/matrizAcceso';
import { Modulos } from 'src/app/models/modulos';
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
  @Input() modulos: Modulos[] = [];
  @Input() acceso: MatrizAcceso;
  form: FormGroup;
readonly = true;
  constructor(
    public modalCtrl: ModalController,
    public modulosService: ModulosService,
    public companiaService: CompaniasService,
    public departamentosService: DepartamentosService,
    public alertasService: AlertasService,
    public usuariosService: UsuariosService,
    public matrizAccesoService: MatrizAccesoService,
    public cd: ChangeDetectorRef,
    public modulosMatrizccesoService: ModulosMatrizAccesoService,
    private fb: FormBuilder
  ) {
 
    
  }

  toggle(mod: Modulos, $event) {
    let i = this.modulos.findIndex((modulo) => modulo.id == mod.id);
    if ($event.detail.checked) {
      this.modulos[i].seleccionado = true;
    } else {
      this.modulos[i].seleccionado = false;
    }
  }
  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  ngOnInit() {
    this.form = this.fb.group({
      rol: [this.acceso.id , [Validators.required]],
      nombre: [this.acceso.nombre , [Validators.required]]
    });
  }
  async editarRolAcceso() {
 
    await this.modulosMatrizccesoService.syncDeleteModuloMatrizAccesoToPromise(
      this.acceso.id
    );

    this.alertasService.presentaLoading('Guardando cambios..');
    this.matrizAccesoService.syncPutMatrizAccesoToPromise(this.acceso).then(
      (resp) => {
        this.alertasService.loadingDissmiss();
        this.matrizAccesoService.syncGetMatrizAccesotoToPromise().then(
          (accesos) => {
            this.matrizAccesoService.matrizAcceso = accesos;
            if (this.modulos.length == 0) {
              this.alertasService.message('D1', 'Acceso actualizado');
              this.modalCtrl.dismiss(true);
            }

            this.modulos.forEach(async (modulo, index) => {
              let mod = {
                seleccionado: modulo.seleccionado,
                id: null,
                iD_MATRIZ_ACCESO: this.acceso.id,
                iD_MODULO: modulo.id,
              };
              if (modulo.seleccionado) {
                await this.modulosMatrizccesoService.syncPostModuloMatrizAccesoToPromise(
                  mod
                );
              }
              if (index == this.modulos.length - 1) {
                this.alertasService.message('D1', 'Acceso actualizado');
                this.modalCtrl.dismiss(true);
              }
            });
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
}
