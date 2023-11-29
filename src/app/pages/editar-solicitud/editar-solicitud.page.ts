import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Solicitudes } from 'src/app/models/solicitudes';
import { AlertasService } from 'src/app/services/alertas.service';
import { CompaniasService } from 'src/app/services/companias.service';
import { SolicitudesService } from 'src/app/services/solicitudes.service';

@Component({
  selector: 'app-editar-solicitud',
  templateUrl: './editar-solicitud.page.html',
  styleUrls: ['./editar-solicitud.page.scss'],
})
export class EditarSolicitudPage implements OnInit {
  @Input() solicitud: Solicitudes;
  companias: any[] = [];
  readonly = true;
  constructor(
    public companiasService: CompaniasService,
    public solicitudesService: SolicitudesService,
    public alertasService: AlertasService,
    public modalCtrl: ModalController
  ) {}
  ngOnInit() {
    console.log('solicitud', this.solicitud);
    this.companiasService.syncGetCompaniasToPromise().then((companias) => {
      companias.forEach((compania) => {
        let data = {
          id: compania.nombre,
          valor: compania.nombre,
        };
        this.companias.push(data);
      });
    });
  }
  actualziarGasto(fRegistroGasto: NgForm) {
    let data = fRegistroGasto.value;
    this.solicitud.coD_COMPANIA = data.compania;
    this.solicitud.fechA_INICIO = data.fechaInicio;
    this.solicitud.fechA_FIN = data.fechaFin;
    this.solicitud.moneda = data.moneda;
    this.solicitud.descripcion = data.descripcion;
    this.solicitud.montO_SOLICITADO = data.montO_SOLICITADO;
    this.solicitud.montO_APROBADO = data.montO_APROBADO;
    this.solicitud.resolucion = data.resolucion;
    this.solicitud.estatus = data.estatus;
    this.solicitudesService
      .syncPutSolicitudToPromise(this.solicitud)
      .then((resp) => {
        this.alertasService.message('D1', 'Solicitud Actualizada!.');
        this.modalCtrl.dismiss(true);
      });
  }
  regresar() {
    this.modalCtrl.dismiss();
  }
}
