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
@Input() gastos:any[];
@Input() total:number = 0;
estadoGasto = '';
message = 'Aprobar Gastos'
color = 'success';
  constructor(
public alertasService: AlertasService,
public gastosService: GastosService,
public modalCtrl:ModalController,
public procesoContableService: ProcesoContableService

  ) { }

  ngOnInit() {
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }
  actualizarGasto(action)
  {
   switch(action){
    case 'Y':
     // this.gasto.procesado = 'Y'
     this.estadoGasto = action;
     this.color = 'success';
     this.message = 'Aprobar Gastos'

    break;
    case 'N':
      //this.gasto.procesado = 'N'
      this.estadoGasto = action;
      this.color = 'warning';
      this.message = 'Rechazar Gastos'
    break;
    case 'C':
      //this.gasto.procesado = 'C'
      this.estadoGasto = action;
      this.color = 'danger';
      this.message = 'Cancelar Gastos'
    break;
    default:

    this.alertasService.message('APP', 'Opción incorrecta..')
   }


      }
      trash(){
        this.modalCtrl.dismiss(true)
      }
     async  actualizar(){
        this.alertasService.presentaLoading('Efectuando cambios..')
        this.gastos.forEach( async (gasto, index) =>{
          gasto.procesado = this.estadoGasto;
        await  this.gastosService.syngPutGastoToPromise(gasto).then((resp:gastos) =>{
            console.log('gasto',resp)
        
          }, async (error) =>{
          await  this.alertasService.loadingDissmiss();
            this.alertasService.message('APP', 'Lo sentimos algo salio mal')
          })
      
          if(index == this.gastos.length -1){
           await this.alertasService.loadingDissmiss();
            this.gastos = [];
            this.gastosService.getViaticos();
            this.modalCtrl.dismiss();

            this.alertasService.presentaLoading('Guardando registros contables...')
          
            let numAsiento = this.randomID();  
        
            let movDir:ONE_MOVDIR = {
        
              Numero : this.gastos[0].referencia,
              Tipo: 'N/D',
              Subtipo:'N/D',
              Fecha: this.gastos[0].fecha,
              Monto:this.total,
              TipoAsiento:'CB',
              Paquete:'CB',
              Concepto:`Pago de
              viáticos +
              ${format(new Date(),'MM/dd/yyyy')} +
              ${format(new Date(),'MM/dd/yyyy')}`,
              Asiento: numAsiento
        
           }
        
           console.log('movDir', movDir);
        await this.procesoContableService.syncPostMovDirToPromise(movDir);
        let asientoDiario:ONE_Asiento_Diario = {
        
          NumAsiento:numAsiento,
          Tipo:'CB',
          Paquete:'CB',
          Concepto:`Pago de viáticos ${format(new Date(),'MM/dd/yyyy')}+ ${format(new Date(),'MM/dd/yyyy')} `, 
          Monto:this.total,
          Fecha:this.gastos[0].fecha  // Fecha Transac 
        
        }
        
        
        console.log('asientoDiario', asientoDiario);
        
        await this.procesoContableService.syncPostAsientoDiarioToPromise(asientoDiario);
        
        let diario:ONE_Diario[]=[
        {
          NumAsiento:numAsiento,
          CentroDeCosto:'00-00-00',
          CuentaConta:'1-01-02-002-007',
          DebitoTotal:null,
          CreditoLocal:this.total,
          Referencia:`Pago de viáticos ${format(new Date(),'MM/dd/yyyy')} + ${format(new Date(),'MM/dd/yyyy')}`
        },
        {
         NumAsiento:numAsiento,
         CentroDeCosto:'00-00-00',
         CuentaConta:'1-01-05-004-011',
         DebitoTotal:this.total,
         CreditoLocal:null,
         Referencia:`Pago de viáticos + ${format(new Date(),'MM/dd/yyyy')} + ${format(new Date(),'MM/dd/yyyy')}`
        },
        {
         NumAsiento:numAsiento,
         CentroDeCosto:'00-00-00',
         CuentaConta:'7-99-01-009-000',
         DebitoTotal:null,
         CreditoLocal:this.total,
         Referencia:`Pago de viáticos ${format(new Date(),'MM/dd/yyyy')} + ${format(new Date(),'MM/dd/yyyy')}`
        }
        
        ]
        
        
        console.log('diario', diario);
        
        await this.procesoContableService.syncPostDiarioToPromise(diario);
        
        
        
       
        


          }
      
        })
      
       
      
            }
            randomID(){
              //define a variable consisting alphabets in small and capital letter  
          var characters = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";  
          var lenString = 14;  
          var randomstring = '';  
          
          //loop to select a new character in each iteration  
          for (var i=0; i<lenString; i++) {  
          var rnum = Math.floor(Math.random() * characters.length);  
          randomstring += characters.substring(rnum, rnum+1);  
          if(i == lenString -1){
          return randomstring
          }
          }  
          }
         
}
