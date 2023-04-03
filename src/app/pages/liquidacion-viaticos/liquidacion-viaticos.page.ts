import { Component, OnInit, Input } from '@angular/core';
import { gastos } from 'src/app/models/gastos';
import { AlertasService } from 'src/app/services/alertas.service';
import { GastosService } from '../../services/gastos.service';
import { ModalController } from '@ionic/angular';
import { format } from 'date-fns';
import { ONE_MOVDIR, ONE_Asiento_Diario, ONE_Diario } from '../../models/procesoContable';
import { ProcesoContableService } from 'src/app/services/proceso-contable.service';

@Component({
  selector: 'app-liquidacion-viaticos',
  templateUrl: './liquidacion-viaticos.page.html',
  styleUrls: ['./liquidacion-viaticos.page.scss'],
})
export class LiquidacionViaticosPage implements OnInit {
  @Input() gastos: any[];
  @Input() total: number;
  @Input() tipo: string;

  estados = [
    {
      id: 'A',
      description: 'Archivados'
    }, {
      id: 'P',
      description: 'Pendientes'
    },
    {
      id: 'C',
      description: 'Canceladas'
    }

  ]
  estadoGasto = 'A';
  liquidar = false;
  message = 'Aprobar Gastos';
  estado = 'Archivado';
  color = 'success';
  today: Date = new Date();
  observaciones = '';
  y = this.today.getFullYear();
  m = this.today.getMonth();
  value1 = new Date(this.y, this.m, 1).toISOString();
  value2 = new Date(this.y, this.m + 1, 0).toISOString();
  constructor(
    public alertasService: AlertasService,
    public gastosService: GastosService,
    public modalCtrl: ModalController,
    public procesoContableService: ProcesoContableService

  ) { }

  ngOnInit() {
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }
  actualizarGasto(action) {
    switch (action) {
      case 'A':
        // this.gasto.procesado = 'Y'
        this.observaciones = null;
        this.estadoGasto = action;
        this.color = 'success';
        this.message = 'Aprobar Gastos'
        this.estado = 'Archivado';
        this.liquidar = true;

        break;
      case 'P':
        //this.gasto.procesado = 'N'
        this.estadoGasto = action;
        this.observaciones = null;
        this.color = 'warning';
        this.message = 'Gasto Pendiente'
        this.estado = 'Pendiente';
        this.liquidar = false;
        break;
      case 'R':
        //this.gasto.procesado = 'C'
        this.observaciones = null;
        this.estadoGasto = action;
        this.color = 'danger';
        this.message = 'Rechazar Gastos'
        this.estado = 'Rechazada';
        this.liquidar = false;
        break;
      default:

        this.alertasService.message('APP', 'Opción incorrecta..')
    }


  }
  trash() {
    this.modalCtrl.dismiss(true)
  }
  async actualizar() {
    this.alertasService.presentaLoading('Efectuando cambios..')
    this.gastos.forEach(async (gasto, index) => {
      gasto.procesado = this.estadoGasto;
      gasto.observaciones = this.observaciones;
      await this.gastosService.syngPutGastoToPromise(gasto).then((resp: gastos) => {
        console.log('gasto', resp)

      }, async (error) => {
        await this.alertasService.loadingDissmiss();
        this.alertasService.message('APP', 'Lo sentimos algo salio mal')
      })

      if (index == this.gastos.length - 1) {
        await this.alertasService.loadingDissmiss();

        if (this.liquidar) {

          this.alertasService.presentaLoading('Guardando registros contables...')

          let numAsiento = this.randomID();

          let asientoDiario: ONE_Asiento_Diario = {

            NumAsiento: numAsiento,
            Tipo: 'CB',
            Paquete: 'CB',
            Concepto: `Pago de ${this.tipo}  ${format(new Date(), 'MM/dd/yyyy')}+ ${format(new Date(), 'MM/dd/yyyy')} `,
            Monto: this.total,
            Fecha: this.gastos[0].fecha  // Fecha Transac      
          }
          console.log('asientoDiario', asientoDiario);
          await this.procesoContableService.syncPostAsientoDiarioToPromise(asientoDiario);
          let diario: ONE_Diario[] = [
            {
              NumAsiento: numAsiento,
              CentroDeCosto: '00-00-00',
              CuentaConta: '1-01-02-002-007',
              DebitoTotal: null,
              CreditoLocal: this.total,
              Referencia: `Pago de ${this.tipo}  ${format(new Date(), 'MM/dd/yyyy')} + ${format(new Date(), 'MM/dd/yyyy')}`
            },
            {
              NumAsiento: numAsiento,
              CentroDeCosto: '00-00-00',
              CuentaConta: '1-01-05-004-011',
              DebitoTotal: this.total,
              CreditoLocal: null,
              Referencia: `Pago de ${this.tipo}  + ${format(new Date(), 'MM/dd/yyyy')} + ${format(new Date(), 'MM/dd/yyyy')}`
            },
            {
              NumAsiento: numAsiento,
              CentroDeCosto: '00-00-00',
              CuentaConta: '7-99-01-009-000',
              DebitoTotal: null,
              CreditoLocal: this.total,
              Referencia: `Pago de ${this.tipo}  ${format(new Date(), 'MM/dd/yyyy')} + ${format(new Date(), 'MM/dd/yyyy')}`
            }

          ]


          console.log('diario', diario);

          await this.procesoContableService.syncPostDiarioToPromise(diario);

    
 


        }
        this.gastosService.getViaticos('P', this.value1, this.value2);
        this.modalCtrl.dismiss(true);

      }

    })



  }
  randomID() {
    //define a variable consisting alphabets in small and capital letter  
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var lenString = 14;
    var randomstring = '';

    //loop to select a new character in each iteration  
    for (var i = 0; i < lenString; i++) {
      var rnum = Math.floor(Math.random() * characters.length);
      randomstring += characters.substring(rnum, rnum + 1);
      if (i == lenString - 1) {
        return randomstring
      }
    }
  }

}
