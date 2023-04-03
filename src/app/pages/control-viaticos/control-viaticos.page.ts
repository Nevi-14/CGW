import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FiltrarGastosPage } from '../filtrar-gastos/filtrar-gastos.page';
import { GastosService } from '../../services/gastos.service';
import { AlertasService } from '../../services/alertas.service';
import { gastos } from '../../models/gastos';
import { Usuario } from 'src/app/models/usuario';
import { ONE_Asiento_Diario, ONE_Diario, ONE_MOVDIR } from 'src/app/models/procesoContable';
import { format } from 'date-fns';
import { ProcesoContableService } from 'src/app/services/proceso-contable.service';
import { LiquidacionViaticosPage } from '../liquidacion-viaticos/liquidacion-viaticos.page';
interface gastosView {
  tipo : string,
  descripcion:string,
  total:number,
usuarios:string[],
  gastos:gastos[]
}
@Component({
  selector: 'app-control-viaticos',
  templateUrl: './control-viaticos.page.html',
  styleUrls: ['./control-viaticos.page.scss'],
})
export class ControlViaticosPage implements OnInit {
  isOpen = false;
  gasto:gastosView;
  gastoIndex =  null;
  textoBuscar = "";
  gastos:gastos[]=[]
  total:number = 0;
  today:Date = new Date();
y = this.today.getFullYear();
m = this.today.getMonth();
value1 = new Date(this.y, this.m , 1).toISOString();
value2 = new Date(this.y, this.m+1 , 0).toISOString();
weeks:number = 0;
  constructor(
public modalCtrl: ModalController,
public gastosService: GastosService,
public alertasService: AlertasService,
public procesoContableService: ProcesoContableService


  ) { }



  estadoGasto(action) {
    let value = '';

    switch (action) {
      case 'A':
        // this.gasto.procesado = 'Y'
       value =  'Archivado';

        break;
      case 'P':
        value =  'Pendiente';
        break;
      case 'R':
        value =  'Rechazado';
        break;
      default:

        this.alertasService.message('APP', 'Opción incorrecta..')
    }
return value;

  }

  ngOnInit() {
    this.gastos = [];
this.cargarDatos();
this.weeks = this.weeks_Of_Month(this.y, this.m)
  }

  cargarDatos(){
 this.gastosService.getViaticos('P',this.value1, this.value2);
  }
  seleccionarGasto(gasto:gastos, index:number){
this.gastoIndex = index;
//this.gasto = gasto;
  }

  trash(){
    this.gastos = [];
  }
   weeks_Of_Month( y, m ) {
    var first = new Date(y, m,1).getDay();      
    var last = 32 - new Date(y, m, 32).getDate(); 
    let currentWeek =  (0 | this.today.getDate() / 7)+1;
    let totalWeeks = Math.ceil( (first + last)/7 );
    // logic to calculate number of weeks for the current month
   // this.addWeeks(first, 5)
    return totalWeeks;   
}

addWeeks(first, weeks) {
let weekss = [];

for( let i =0; i < weeks; i++){
  let date:Date =  new Date(this.y, this.m,1)
  date.setDate(date.getDate() + i * 7)
  //let lastDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7)
  //    date.setDate(date.getDate() + 7 * i)
 
weekss.push(date)
  if( i == weeks -1){
    alert(JSON.stringify(weekss))
    return date;
  }
}
 

}
  retornarGastosUsuario(usuario, tipo){
    this.gastos = [];
    this.total  = 0;
    console.log('usuario', usuario);
    console.log('tipo', tipo)
    for(let i = 0; i < this.gastosService.viaticos.length; i++){

    

      this.gastosService.viaticos[i].gastos.forEach( gasto =>{
        if(gasto.usuario == usuario && gasto.descripcion == tipo){
          this.total += gasto.monto;
          this.gastos.push(gasto);
        }
        
      })
    
      if(i == this.gastosService.viaticos.length -1){
        console.log('gastos', this.gastos)
        this.liquidacionViaticos(this.gastos)
      }
    }

  }
  onSearchChange(event){

    this.textoBuscar = event.detail.value;
      }



      async liquidacionViaticos(gastos:gastos[]){
        this.isOpen = true;
            
              const modal = await this.modalCtrl.create({
         component:LiquidacionViaticosPage,
         cssClass:'alert-modal',
         componentProps:{
          gastos:gastos,
          total:this.total,
          tipo:gastos[0].descripcion
         }
              });
        
        if(this.isOpen){
        
          modal.present();
          const {data} = await modal.onWillDismiss();
          this.isOpen = false;
          if(data != undefined){
        this.trash();
             
          }
        }
        
    
      }

  async filtrarGastos(){
    this.isOpen = true;
        
          const modal = await this.modalCtrl.create({
     component:FiltrarGastosPage,
     cssClass:'alert-modal'
          });
    
    if(this.isOpen){
    
      modal.present();
      const {data} = await modal.onWillDismiss();
      this.isOpen = false;
      if(data != undefined){
    
         
      }
    }
    

  }

}
