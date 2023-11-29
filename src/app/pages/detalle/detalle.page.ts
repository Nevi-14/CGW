import { Component } from '@angular/core';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage {
  image = '../assets/imgs/devCodingLogo.svg';
  public appPages = [
    { title: 'Inicio', url: '/inicio/detalle', icon: 'home' },
   // { title: 'Departamentos', url: '/inicio/control-departamentos', icon: 'business' },
    { title: 'Acceso', url: '/inicio/control-matriz-acceso', icon: 'shield' },
    { title: 'Usuarios', url: '/inicio/control-usuarios', icon: 'people' },
    { title: 'Aprobadores', url: '/inicio/aprobadores', icon: 'prism' },
    { title: 'Solicitudes', url: '/inicio/solicitudes', icon: 'file-tray-full' },
    { title: 'Gestión Anticipos', url: '/inicio/control-anticipos', icon: 'document-text' },
    //{ title: 'Viáticos', url: '/inicio/control-viaticos', icon: 'cash' },
    { title: 'Gastos Sin Anticipos', url: '/inicio/gastos-sin-anticipo', icon: 'wallet' },
    { title: 'Estados Cuenta', url: '/inicio/control-estados-cuenta', icon: 'card' },
    { title: 'Cerrar Sesión', url: 'salir', icon: 'exit' }
   
  ];
  constructor() { }
}
