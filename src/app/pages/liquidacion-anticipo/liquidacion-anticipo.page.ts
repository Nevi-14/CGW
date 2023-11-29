import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { format } from 'date-fns';
import { LineaAnticipo } from 'src/app/models/adelantoViaticos';
import { cuentasBancos } from 'src/app/models/cuentasBancos';
import { cuentasGastos } from 'src/app/models/cuentsaGastos';
import { EstadosCuenta } from 'src/app/models/estadosCuenta';
import { LineaGasto } from 'src/app/models/gastos';
import {
  ONE_Asiento_Diario,
  ONE_Diario,
  ONE_MOVDIR,
} from 'src/app/models/procesoContable';
import { AdelantoViaticosService } from 'src/app/services/adelanto-viaticos.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { AnticiposService } from 'src/app/services/anticipos.service';
import { CierreContableService } from 'src/app/services/cierre-contable.service';
import { CompaniasService } from 'src/app/services/companias.service';
import { EstadosCuentaService } from 'src/app/services/estados-cuenta.service';
import { GastosService } from 'src/app/services/gastos.service';
import { LineasAnticiposService } from 'src/app/services/lineas-anticipos.service';
import { ProcesoContableService } from 'src/app/services/proceso-contable.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CentroCostosPage } from '../centro-costos/centro-costos.page';
import { concat } from 'rxjs';
@Component({
  selector: 'app-liquidacion-anticipo',
  templateUrl: './liquidacion-anticipo.page.html',
  styleUrls: ['./liquidacion-anticipo.page.scss'],
})
export class LiquidacionAnticipoPage implements OnInit {
  @Input() linea: LineaAnticipo;
  @Input() gastos: LineaGasto[] = [];

  diario: ONE_Diario[] = [];
  postAsiento: ONE_Diario = null;
  postSobrante: ONE_Diario = null;
  postExcedente: ONE_Diario = null;
  movDirSobrante: ONE_MOVDIR = null;
  asientoDiarioSobrante: ONE_Asiento_Diario = null;
  diarioSobrante: ONE_Diario[] = [];
  diarioDB: ONE_Diario[] = [];
  dataDiarioDB: ONE_Diario[] = [];
  nuevosDiarioDB: ONE_Diario[] = [];
  asientoDB = [];
  cuentasBancos: cuentasBancos[] = [];
  cuentasGastos: cuentasGastos[] = [];
  data = [];
  rows = [];
  temp = [];
  pageSize = 4;
  currentPage = 1;
  
centros = [];
  constructor(
    public modalCtrl: ModalController,
    public adelantosService: AdelantoViaticosService,
    public procesoContableService: ProcesoContableService,
    public usuariosService: UsuariosService,
    public cierreContableService: CierreContableService,
    public gastosService: GastosService,
    public lienasAnticiposService: LineasAnticiposService,
    public alertasService: AlertasService,
    public router: Router,
    public estadosCuentaService: EstadosCuentaService,
    public companiasService: CompaniasService,
    public adelantoViaticosService: AdelantoViaticosService,
    public anticiposService: AnticiposService,
  ) {}
 // PAGINATED DATA
 get paginatedData(): any[] {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  return this.data.slice(startIndex, startIndex + this.pageSize);
}

todos($event){
  let todos = $event.detail.checked;
  if(todos){
    this.data = [...this.dataDiarioDB]
  }else{
    this.data = [...this.dataDiarioDB];
    this.data = this.data.filter(e => e.fuente == 'CG');
  }
  }

fuenteChange($event) {
 let fuente = $event.detail.value;
 console.log(this.dataDiarioDB, 'this.dataDiarioDB');
let data = [...this.dataDiarioDB];
 this.data = data.filter(e => e.fuente == fuente);
 console.log(fuente, 'fuente');

}
// NEXT PAGE
nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}

get totalPages(): number {
  return Math.ceil(this.data.length / this.pageSize);
}

// PREVIOUS PAGE
previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}
 

  // SELECCIONAR TODO
  selectAll(event) {
    if (event.detail.checked) {
      this.data.forEach((item) => {
        item.seleccionado = true;
      });
    } else {
      this.data.forEach((item) => {
        item.seleccionado = false;
      });
    }
  }
  regresar(){
   this.router.navigateByUrl('/inicio/detalle-anticipo');
  }
  async ngOnInit() {
    let usuarios = [];
    this.centros =  await  this.companiasService.syncGetCompaniaCuentaGastos(this.adelantosService.adelantoViatico.coD_COMPANIA);
    this.cuentasGastos =
    await this.companiasService.syncGetCompaniaCuentaGastos(
      this.adelantosService.adelantoViatico.coD_COMPANIA
    );
    let anticipo = await this.procesoContableService.syncGetAsientoDiario(
      this.adelantoViaticosService.adelantoViatico.asiento
    );

    this.diarioDB = await this.procesoContableService.syncGetDiario(
      this.adelantosService.adelantoViatico.asiento
    );


    if (anticipo.length > 0) {
      this.diarioDB = this.diarioDB.concat(
        await this.procesoContableService.syncGetDiario(
          anticipo[0].asientO_CIERRE
        )
      );
    }

    this.asientoDB = await this.procesoContableService.syncGetAsientoDiario(
      this.adelantosService.adelantoViatico.asiento
    );
   
    this.alertasService.presentaLoading('Cargando...');
    let  consecutivo = this.diarioDB.length;
    let totalDiario = 0;
   
    this.gastosService
      .syncGetGastosAnticipoToPtomise(this.adelantosService.adelantoViatico.id)
      .then(
        async (gastos) => {


          // start
          console.log(gastos, 'gastos');

          gastos.forEach(async (gasto, gastoIndex) => {

      
            consecutivo++;

            let cuenta: cuentasGastos = this.cuentasGastos.find(
              (e) => e.gasto == gasto.tipO_GASTO
            );
   
            let referencia = `Usuario : ${gasto.usuario} - Gastos ${cuenta ? cuenta.descripcion : ''} ${format(
              new Date(this.adelantosService.adelantoViatico.fechA_INICIAL),
              'MM/dd/yyyy'
            )}  ${format(
              new Date(this.adelantosService.adelantoViatico.fechA_FINAL),
              'MM/dd/yyyy'
            )}`;

        totalDiario += gasto.monto;

        if(gasto.porcentajeiva > 0){
          this.nuevosDiarioDB.push(
            await this.cierreContableService.generarDiario(

              'CG',
              this.adelantosService.adelantoViatico.coD_COMPANIA,
              null,
              consecutivo,
             gasto.centrO_COSTOS,
             `Usuario : ${gasto.usuario} - Gastos ${cuenta ? cuenta.descripcion : ''} ${format(
              new Date(this.adelantosService.adelantoViatico.fechA_INICIAL),
              'MM/dd/yyyy'
            )}  ${format(
              new Date(this.adelantosService.adelantoViatico.fechA_FINAL),
              'MM/dd/yyyy'
            )}`,
              false,
              this.adelantosService.adelantoViatico.moneda,
              gasto.monto - gasto.montoiva,
              false,
              true,
              cuenta ? cuenta.cuenta : 'Sin Cuenta'
            )
          );
          consecutivo++;
          this.nuevosDiarioDB.push(
            await this.cierreContableService.generarDiario(

              'CG',
              this.adelantosService.adelantoViatico.coD_COMPANIA,
              null,
              consecutivo,
             gasto.centrO_COSTOS,
             `Usuario : ${gasto.usuario} - IVA Gastos ${cuenta ? cuenta.descripcion : ''} ${format(
              new Date(this.adelantosService.adelantoViatico.fechA_INICIAL),
              'MM/dd/yyyy'
            )}  ${format(
              new Date(this.adelantosService.adelantoViatico.fechA_FINAL),
              'MM/dd/yyyy'
            )}`,
              false,
              this.adelantosService.adelantoViatico.moneda,
              gasto.montoiva,
              false,
              true,
              cuenta ? cuenta.cuenta : 'Sin Cuenta'
            )
          );
        }else{
         // consecutivo++;
          this.nuevosDiarioDB.push(
            
            await this.cierreContableService.generarDiario(

            'CG',
              this.adelantosService.adelantoViatico.coD_COMPANIA,
              null,
              consecutivo,
             gasto.centrO_COSTOS,
              referencia,
              false,
              this.adelantosService.adelantoViatico.moneda,
              gasto.monto,
              false,
              true,
              cuenta ? cuenta.cuenta : 'Sin Cuenta'
            )
          );
        }
        let iu = usuarios.findIndex(e => e == gasto.usuario);
        console.log(iu,'iu')
        if(iu < 0){
          usuarios.push(gasto.usuario);
          consecutivo++;

          let diario = await this.cierreContableService.generarDiario(

            'CG',
            this.adelantosService.adelantoViatico.coD_COMPANIA,
            null,
            consecutivo,
            '00-00-00',
            `Usuario : ${gasto.usuario} -  Liquidación de viáticos Anticipo ${format(
              new Date(this.adelantosService.adelantoViatico.fechA_INICIAL),
              'MM/dd/yyyy'
            )}  ${format(
              new Date(this.adelantosService.adelantoViatico.fechA_FINAL),
              'MM/dd/yyyy'
            )}`,
            false,
            this.adelantosService.adelantoViatico.moneda,
            gasto.montO_ANTICIPO,
            true,
            false
          );
          this.nuevosDiarioDB.push(diario);
          if(gasto.restante > 0){
            consecutivo++;
            let postSobrante =
            await this.cierreContableService.generarDiario(

              'CG',
              this.adelantosService.adelantoViatico.coD_COMPANIA,
              null,
              consecutivo, // use the number 4 directly
              '00-00-00',
              `Usuario : ${gasto.usuario} -  Sobrante de viáticos Anticipo ${format(
                new Date(this.adelantosService.adelantoViatico.fechA_INICIAL),
                'MM/dd/yyyy'
              )}  ${format(
                new Date(this.adelantosService.adelantoViatico.fechA_FINAL),
                'MM/dd/yyyy'
              )}`,
              true,
              this.adelantosService.adelantoViatico.moneda,
              gasto.restante,
              false,
              true
            );
          this.nuevosDiarioDB.push(postSobrante);
          }

          if(gasto.excedente > 0){
            consecutivo++;
       let postExcedente =     await this.cierreContableService.generarDiario(

        'CG',
              this.adelantosService.adelantoViatico.coD_COMPANIA,
              null,
              consecutivo, // use the number 4 directly
              '00-00-00',
              `Usuario : ${gasto.usuario} -  Excedente de viáticos Anticipo ${format(
                new Date(this.adelantosService.adelantoViatico.fechA_INICIAL),
                'MM/dd/yyyy'
              )}  ${format(
                new Date(this.adelantosService.adelantoViatico.fechA_FINAL),
                'MM/dd/yyyy'
              )}`,
              true,
              this.adelantosService.adelantoViatico.moneda,
              gasto.excedente,
              true,
              false
            );
          this.nuevosDiarioDB.push(postExcedente);
          }
        }
 
 
            if (gastoIndex == gastos.length - 1) {
               console.log(this.nuevosDiarioDB, 'this.nuevosDiarioDB')
               console.log(this.diarioDB, 'this.diarioDB')
             //  this.data = this.nuevosDiarioDB;
             this.dataDiarioDB =  this.dataDiarioDB.concat(this.diarioDB);
             this.dataDiarioDB =  this.dataDiarioDB.concat(this.nuevosDiarioDB);
      this.data = [...this.dataDiarioDB];
      this.data = this.data.filter(e => e.fuente == 'CG');
 
 

              //  cargar lineas   liquidacion, sobrantes, excedentes
              this.nuevosDiarioDB.sort((a, b) => a.consecutivo - b.consecutivo);
               this.alertasService.loadingDissmiss();
            }
          });


// end



        },
        (error) => {
          this.alertasService.loadingDissmiss();
          this.alertasService.message('Error', 'Error al cargar los gastos');
        }
      );
  }
  cerrarModal() {
    this.modalCtrl.dismiss();
  }
  
  async centrosCostos() {
    const modal = await this.modalCtrl.create({
      component: CentroCostosPage,
      cssClass: 'medium-modal',
      mode: 'ios',
      componentProps: {
       centroCostos : this.centros
      }
    });

    modal.present();
    const { data } = await modal.onWillDismiss();
    if (data != undefined) {
      //this.centroCosto  = data
    }
  }
  incrementString(paquete: string, str: string): string {
    let prefix = paquete; // get the first two letters

    if (!str) {
      return prefix + '00000001';
    }
    let numberPart = str.substring(2); // get the number part

    // Use regex to extract leading zeros and the numeric part
    const regexResult = numberPart.match(/^0*(\d+)$/);

    if (regexResult) {
      let number = parseInt(regexResult[1]); // convert the numeric part to a number
      number++; // increment the number

      // Convert the incremented number back to a string and pad with leading zeros
      let newNumberPart = number.toString().padStart(numberPart.length, '0');

      return prefix + newNumberPart;
    } else {
      // If the number part doesn't match the expected format, return an error or handle it as needed
      return this.incrementString(paquete, str);
    }
  }

  async liquidar() {
  
    let paquete = 'CG';
    let consecutivo =
      await this.adelantoViaticosService.syncGetUltimoConsecutivo(
        this.adelantoViaticosService.adelantoViatico.coD_COMPANIA,
        paquete
      );
    let numAsiento = this.incrementString(
      paquete,
      consecutivo ? consecutivo.asiento : null
    );
    let tipO_ASIENTO = 'CG';
    let contabilidad = 'A';
    let origen = 'CG';
    let clasE_ASIENTO = 'N';

    let asientoDiario: ONE_Asiento_Diario =
      await this.cierreContableService.generarAsiento(
        this.adelantoViaticosService.adelantoViatico.coD_COMPANIA,
        numAsiento,
        this.adelantoViaticosService.adelantoViatico.asiento,
        paquete,
        tipO_ASIENTO,
        contabilidad,
        origen,
        clasE_ASIENTO,
        true,
        this.adelantoViaticosService.adelantoViatico.moneda,
        this.adelantoViaticosService.adelantoViatico.monto,
        true,
        false,
        `Liquidacion Anticipo`
      );

    this.nuevosDiarioDB.forEach(async (diario, index) => {
      diario.asiento = numAsiento;
      if (index == this.nuevosDiarioDB.length - 1) {
        let anticipo = await this.procesoContableService.syncGetAsientoDiario(
          this.adelantoViaticosService.adelantoViatico.asiento
        );
        anticipo[0].asientO_CIERRE = numAsiento;
        await this.procesoContableService.syncPutAsientoDiarioToPromise(
          anticipo[0]
        );
        await this.procesoContableService.syncPostAsientoDiarioToPromise(
          asientoDiario
        );
        this.alertasService.presentaLoading('Guadando cambios...');
        this.adelantosService.adelantoViatico.estatus = 'F';
        this.adelantoViaticosService.adelantoViatico.asientO_CIERRE = numAsiento;
        await this.adelantosService.syncPuttAdelantoViaticosToPromise(
          this.adelantosService.adelantoViatico
        );
        // [this.postAsiento, this.postSobrante]
        await this.procesoContableService.syncPostDiarioToPromise(
          this.adelantosService.adelantoViatico.restante > 0
            ? this.nuevosDiarioDB
            : this.nuevosDiarioDB
        );

        this.lienasAnticiposService
          .syncGetLineasAnriciposToPromise(
            this.adelantosService.adelantoViatico.id
          )
          .then(
            (resp) => {
              resp.forEach(async (linea, index) => {
                let estadoCuenta: EstadosCuenta = {
                  id: null,
                  anticipo: true,
                  referencia:
                    this.adelantosService.adelantoViatico.numerO_TRANSACCION,
                  usuario: linea.usuario,
                  fecha: format(new Date(), 'MM/dd/yyyy'),
                  fechA_INICIAL: format(
                    new Date(
                      this.adelantosService.adelantoViatico.fechA_INICIAL
                    ),
                    'MM/dd/yyyy'
                  ),
                  fechA_FINAL: format(
                    new Date(this.adelantosService.adelantoViatico.fechA_FINAL),
                    'MM/dd/yyyy'
                  ),
                  monto: linea.monto,
                  restante: linea.restante,
                  utilizado: linea.utilizado,
                  observaciones: 'observaciones',
                };
                await this.estadosCuentaService.syncPostEstadosCuentaToPromise(
                  estadoCuenta
                );
                if (index == resp.length - 1) {
                  await this.alertasService.loadingDissmiss();
                  this.cerrarModal();
                  this.router.navigateByUrl('/inicio/control-estados-cuenta', {
                    replaceUrl: true,
                  });
                }
              });
            },
            (error) => {
              console.log('error', error);
            }
          );
      }
    });
  }
}
