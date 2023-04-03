import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { adelantoViaticos } from 'src/app/models/adelantoViaticos';
import { AdelantoViaticosService } from '../../services/adelanto-viaticos.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { ONE_Asiento_Diario, ONE_MOVDIR } from 'src/app/models/procesoContable';
import { ONE_Diario } from '../../models/procesoContable';
import { format } from 'date-fns';
import { ProcesoContableService } from '../../services/proceso-contable.service';

@Component({
  selector: 'app-crear-adelanto-viaticos',
  templateUrl: './crear-adelanto-viaticos.page.html',
  styleUrls: ['./crear-adelanto-viaticos.page.scss'],
})
export class CrearAdelantoViaticosPage implements OnInit {
  @Input() adelantoVaticos:adelantoViaticos[]=[];
  constructor(
   public  modalCtrl:ModalController,
   public router:Router,
   public adelantoViaticosService: AdelantoViaticosService,
   public alertasService:AlertasService,
   public procesoContableService:ProcesoContableService 
  ) { }

  ngOnInit() {
   
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
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

  delete(){
    this.alertasService.message('DIONE', 'La opción no se encuentra disponible..')
  }

  edit(){
    this.alertasService.message('DIONE', 'La opción no se encuentra disponible..')
  }
 async generarPost(){
   this.alertasService.presentaLoading('Guardando cambios...')
    for(let i =0; i < this.adelantoVaticos.length ; i++){

    let numAsiento = this.randomID();  

    let movDir:ONE_MOVDIR = {

      Numero : this.adelantoVaticos[i].numeroTransaccion,
      Tipo: 'N/D',
      Subtipo:'N/D',
      Fecha: this.adelantoVaticos[i].fechaTransaccion,
      Monto:this.adelantoVaticos[i].monto,
      TipoAsiento:'CB',
      Paquete:'CB',
      Concepto:`Pago de
      viáticos +
      ${format(this.adelantoVaticos[i].fechaInicial,'MM/dd/yyyy')} +
      ${format(this.adelantoVaticos[i].fechaFinal,'MM/dd/yyyy')}`,
      Asiento: numAsiento

   }

   console.log('movDir', movDir);
await this.procesoContableService.syncPostMovDirToPromise(movDir);
let asientoDiario:ONE_Asiento_Diario = {

  NumAsiento:numAsiento,
  Tipo:'CB',
  Paquete:'CB',
  Concepto:`Pago de viáticos ${format(this.adelantoVaticos[i].fechaInicial,'MM/dd/yyyy')} + ${format(this.adelantoVaticos[i].fechaFinal,'MM/dd/yyyy')}`, 
  Monto:this.adelantoVaticos[i].monto,
  Fecha:this.adelantoVaticos[i].fechaTransaccion  // Fecha Transac 

}


console.log('asientoDiario', asientoDiario);

await this.procesoContableService.syncPostAsientoDiarioToPromise(asientoDiario);

let diario:ONE_Diario[]=[
{
  NumAsiento:numAsiento,
  CentroDeCosto:'00-00-00',
  CuentaConta:'1-01-02-002-007',
  DebitoTotal:null,
  CreditoLocal:this.adelantoVaticos[i].monto,
  Referencia:`Pago de viáticos ${format(this.adelantoVaticos[i].fechaInicial,'MM/dd/yyyy')} + ${format(this.adelantoVaticos[i].fechaFinal,'MM/dd/yyyy')}`
},
{
 NumAsiento:numAsiento,
 CentroDeCosto:'00-00-00',
 CuentaConta:'1-01-05-004-011',
 DebitoTotal:this.adelantoVaticos[i].monto,
 CreditoLocal:null,
 Referencia:`Pago de viáticos + ${format(this.adelantoVaticos[i].fechaInicial,'MM/dd/yyyy')}  + ${format(this.adelantoVaticos[i].fechaFinal,'MM/dd/yyyy')}`
},
{
 NumAsiento:numAsiento,
 CentroDeCosto:'00-00-00',
 CuentaConta:'7-99-01-009-000',
 DebitoTotal:null,
 CreditoLocal:this.adelantoVaticos[i].monto,
 Referencia:`Pago de viáticos ${format(this.adelantoVaticos[i].fechaInicial,'MM/dd/yyyy')} + ${format(this.adelantoVaticos[i].fechaFinal,'MM/dd/yyyy')} +  ${this.adelantoVaticos[i].destinatario}`
}

]


console.log('diario', diario);

await this.procesoContableService.syncPostDiarioToPromise(diario);
console.log('this.adelantoVaticos[i]',this.adelantoVaticos[i])
await this.adelantoViaticosService.syncPostAdelantoViaticosToPromise(this.adelantoVaticos[i]); 

      if(i == this.adelantoVaticos.length -1){
   await      this.alertasService.loadingDissmiss();
       this.cerrarModal();
       this.router.navigateByUrl('/inicio/control-adelanto-viaticos', { replaceUrl: true })
      }
    }

   

  }

}
