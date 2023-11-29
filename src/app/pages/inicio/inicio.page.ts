import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform, ModalController } from '@ionic/angular';
import { ConfiguracionesService } from '../../services/configuraciones';
import { PerfilPage } from '../perfil/perfil.page';
import { UsuariosService } from 'src/app/services/usuarios.service';
 
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
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
  titulo = '';
  class: boolean = false;
  width: number;
  url = null;
  showMenu = false;
  large: boolean;
  small: boolean;
  image = '../assets/islena.png';
  isOpen = false;
  constructor(
    public router: Router,
    public menuCtrl: MenuController,
    public plt: Platform,
    public configuracionesService: ConfiguracionesService,
    public modalCtrl: ModalController,
    public usuariosService:UsuariosService


  ) { }

  dkmrg() {
    this.menuCtrl.swipeGesture(true)
  }
  ngOnInit() {
this.url =  localStorage.getItem('currentUrl');
    this.width = this.plt.width();
  }


  revisarAcceso(ruta:string){
 
   let i =  this.usuariosService.accesoModulos.findIndex( e => e.ruta == ruta);
   if (i >=0){
    return true;
   }

   return false;
  }

  // REMVOE MENU ON BIGGER SCREENS
  menuAction(url, titulo) {
    this.class = false;
    this.configuracionesService.menu = false;
 
    if (url == 'perfil') {
      this.perfil();
    } else if (url == 'salir') {
      this.cerrarSesion();
    } else {
   
    
      this.url = url;
      this.router.navigateByUrl(url, { replaceUrl: true })
    }
 if (url != '/inicio/detalle'  &&    url != 'perfil' && url != 'salir' ){
  this.titulo = titulo;
 }else {
  this.titulo = '';
 }
    if( this.configuracionesService.menu){

      this.configuracionesService.menu = false;
      this.menuCtrl.toggle('myMenu');
    }
  }
  openMenu() {
    if (!this.configuracionesService.menu) {
      this.class = true;
      this.menuCtrl.open();
      this.configuracionesService.menu = true;
    }

  }

  closeMenu() {
    if (this.configuracionesService.menu) {
      this.class = false;
      this.menuCtrl.close();
      this.configuracionesService.menu = false;
    }

  }
  toggleMenu() {

    if (this.width > 768) {
      this.large = true;
      this.small = false;
      this.class = true;
       this.menuCtrl.toggle('myMenu');
      this.small = false;
    } else {
      this.class = false;
      this.large = false;
      this.small = true;
       this.menuCtrl.toggle('myMenu');




    }

  }

  toggle(){
    this.configuracionesService.menu = !this.configuracionesService.menu ;
    this.menuCtrl.toggle('myMenu');
    console.log('true')
  
     
     }
  // CHECKS SCREEN RESIZE LIVE

  @HostListener('window:resize', ['$event'])

  private onResize(event) {

    this.width = event.target.innerWidth;

    this.toggleMenu();

  }
  async perfil() {
    this.isOpen = true;


    const modal = await this.modalCtrl.create({
      component: PerfilPage,
      cssClass: 'medium-modal'
    });

    if (this.isOpen) {

      modal.present();
      const { data } = await modal.onWillDismiss();
      this.isOpen = false;
      if (data != undefined) {


      }
    }



  }
  setTitle(titulo) {
    this.configuracionesService.title = titulo;
    this.configuracionesService.menu = false;

  }
  cerrarSesion() {
      
    this.router.navigate(['/inicio-sesion']);
    localStorage.removeItem('usuario')
    this.usuariosService.usuario = null;
  }

  descargarManual(){
    window.open('https://drive.google.com/file/d/1wHNdaaLySt-wRia_5p17eMLFX1iIr8Om/view?usp=sharing','_blank')
  }
}
