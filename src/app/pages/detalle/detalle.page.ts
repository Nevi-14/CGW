import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  image = '../assets/imgs/devCodingLogo.svg';
  public appPages = [
    { title: 'Inicio', url: '/inicio/detalle', icon: 'home' },
    { title: 'Acceso', url: '/inicio/control-matriz-acceso', icon: 'shield' },
    { title: 'Gestión Anticipos', url: '/inicio/control-anticipos', icon: 'document-text' },
 //   { title: 'Viáticos', url: '/inicio/control-viaticos', icon: 'cash' },
    { title: 'Estados Cuenta', url: '/inicio/control-estados-cuenta', icon: 'card' }
   
  ];
  constructor() { }

  ngOnInit() {
  }

}
