import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { estadosCuenta } from 'src/app/models/estadosCuenta';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { format } from 'date-fns';
import { AlertasService } from 'src/app/services/alertas.service';
import { Usuario } from 'src/app/models/usuario';
import { CalendarioPopoverPage } from '../calendario-popover/calendario-popover.page';
import { EstadosCuentaService } from 'src/app/services/estados-cuenta.service';

@Component({
  selector: 'app-estado-cuenta',
  templateUrl: './estado-cuenta.page.html',
  styleUrls: ['./estado-cuenta.page.scss'],
})
export class EstadoCuentaPage implements OnInit {
  usuarios:Usuario[]=[]
estadoCuenta:estadosCuenta ={
  id:null,
  remitente: this.usuariosService.usuario.usuario,
  destinatario:null,
  fecha: null,
  monto: 0,  
  archivo:null,
  ruta:null
}
usuario = null;
file = null;
filePath = null;
fileName = null;
formatoFecha = new Date(format(new Date(), 'yyy/MM/dd')).toISOString();
  constructor(
    public modalCtrl: ModalController,
    public popOverCtrl: PopoverController,
  public alertasService: AlertasService,
  public usuariosService: UsuariosService,
  public estadosCuentaService: EstadosCuentaService
  ) { }

  ngOnInit() {
    this.cargarDatos();
  }
  cerrarModal(){
    this.modalCtrl.dismiss();
    
      }
      cargarDatos(){
        this.estadoCuenta.fecha = new Date(this.formatoFecha);
    this.alertasService.presentaLoading('Cargando datos..')
    this.usuariosService.syncGetUsuariosToPromise().then(resp =>{
      this.alertasService.loadingDissmiss();
    this.usuarios = resp;
    }, error =>{
      this.alertasService.loadingDissmiss();
      this.alertasService.message('APP', 'Lo sentimos algo salio mal..')
    })
    
      }

      seleccionarUsuario(usuario:Usuario, index){
        this.estadoCuenta.destinatario = usuario.usuario;
        this.usuario = index;
      }
    
      async fecha(){
        const popover = await this.popOverCtrl.create({
          component:CalendarioPopoverPage,
          cssClass:'my-custom-class',
          translucent:true,
          componentProps:{
           fecha: this.formatoFecha
          }
        })
    
        await popover.present();
        const { data } = await popover.onDidDismiss();
      
        if(data != undefined){
         
          let fecha= new Date(data.fecha).toLocaleDateString('Es', {
            year: 'numeric',
            month: '2-digit',
            weekday: 'short',
            day: 'numeric',
          });
          
          this.formatoFecha = data.fecha;
          this.estadoCuenta.fecha = new Date(this.formatoFecha);
        }
    
    
      }
      adjuntarArchivo($event){
        // Get a reference to the file that has just been added to the input
       this.file =  $event.target.files[0];
      let reader = new FileReader();
      reader.onload = (event:any) => {
        this.filePath = event.target.result;
        this.fileName = this.file.name;
        this.estadoCuenta.archivo = this.fileName;
        
        console.log('file', this.file)
      }
      reader.readAsDataURL($event.target.files[0]);  // to trigger onload
      }
      generarPost(){

        if(!this.file){
          this.alertasService.message('APP', 'Debes ed adjuntar el archivo antes de proceder..')
          return
        }
        this.alertasService.presentaLoading('Guardando Datos...')
         this.estadosCuentaService.syncPostEstadosCuentaToPromise(this.estadoCuenta).then((resp:estadosCuenta) =>{

          const estado = resp;
 
          if(this.file){
            const formData = new FormData();
            formData.append('image', this.file, this.file.name);
             this.estadosCuentaService.syncPostEstadoCuentaArchivoToPromise(resp.id, formData).then((resp:any) => {
              this.alertasService.loadingDissmiss();
              this.modalCtrl.dismiss({
                estado:estado
              })
             console.log('archivo guardado  ' , resp)  
             this.borrarImagen();
            }, error =>{
              console.log('error  ' , error)
              this.borrarImagen();
              this.alertasService.message('APP', error)
             // this.cerrarModal();
            })

          }else{
            this.alertasService.loadingDissmiss();
            this.modalCtrl.dismiss(true)

          }
   
    
         },error =>{
          this.alertasService.loadingDissmiss();
          this.alertasService.message('APP', 'Lo sentimos algo salio mal...')
         })
    
        
          }

   

          borrarImagen(){


            this.file = null;
           }
}
