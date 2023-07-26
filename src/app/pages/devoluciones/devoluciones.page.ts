import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-devoluciones',
  templateUrl: './devoluciones.page.html',
  styleUrls: ['./devoluciones.page.scss'],
})
export class DevolucionesPage implements OnInit {
  @Input() devolucion:any
  img = null
  file:any  = null;
  estatus = [
    {
     id: 'P',
     valor : 'Pendiente'
    },
    {
      id: 'RA',
      valor : 'Requiere Aprobación'
     },
    {
      id: 'A',
      valor : 'Aprobado'
     },
     {
      id: 'R',
      valor : 'Rechazado'
     }
  ]
  metodoDevolucion = [
    {
     id: 'S',
     valor : 'Sinpe Móvil'
    },
    {
      id: 'T',
      valor : 'Transferencia'
     },
    {
      id: 'D',
      valor : 'Deposito'
     } 
  ]
  readonly:boolean= true;
  constructor(
  public modalCtrl:ModalController  
  ) { }

  ngOnInit() {
  }
  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  actualizarDevolucion(fSobrante:NgForm){

  }
}
