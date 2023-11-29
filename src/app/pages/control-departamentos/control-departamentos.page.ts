import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { CrearDepartamentoPage } from '../crear-departamento/crear-departamento.page';
import { Departamentos } from 'src/app/models/departamentos';
import { EditarDepartamentoPage } from '../editar-departamento/editar-departamento.page';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
@Component({
  selector: 'app-control-departamentos',
  templateUrl: './control-departamentos.page.html',
  styleUrls: ['./control-departamentos.page.scss'],
})
export class ControlDepartamentosPage implements OnInit {
  isOpen:boolean = false;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  public columns: any;
  public rows: any[];
  temp = [];
  width = '100%'
  multi:any ='multi';
  scrollBarHorizontal = (window.innerWidth < 1200);
  constructor(
  public alertasService:AlertasService,
  public modalCtrl:ModalController,
  public departamentosService:DepartamentosService,
  public alertCrl: AlertController,
  public usuariosService: UsuariosService  
  ) { 

 this.cargarDatos();

  }
  @HostListener('window:resize', ['$event'])
  private  onResize(event) {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
      console.log(this.scrollBarHorizontal)
      this.width = '100%';
    }

    cargarDatos(){

      this.columns = [
        { id: "id", label: "ID"},
        { id: "nombre", label: "Nombre"},
        { id: "descripcion", label: "Descripcion"},
        { id: "opciones", label: "Opciones" }
    ];
     this.departamentosService.syncGetDepartamentoToPromise()
        .then((res) => {
          console.log(res)
          this.temp = [...res];
  
        // push our inital complete list
        this.rows = res;
        });
    }
  editarElemento(row) {
    console.log(row,'editarElemento');
    let i = this.rows.findIndex( e => e.id == row.id);
    if(i >= 0){
      this.editarDepartamento(this.rows[i])
    }
  }
  borrarElemento(row) {
    let i = this.rows.findIndex( e => e.id == row.id);
    if(i >= 0){
      this.borrarDepartamento(this.rows[i])
    }

    console.log(row,'borrarElemento');
  }
  
 
   updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
    //d.nombre, d.descripcion, etc..
    console.log('d',d)
      return d.nombre.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  
  }
  ngOnInit() {
    this.alertasService.presentaLoading('Cargando datos..');
    this.departamentosService.syncGetDepartamentoToPromise().then(departamentos =>{
      this.departamentosService.departamentos = departamentos
      this.alertasService.loadingDissmiss();
    }, error =>{
      this.alertasService.loadingDissmiss();
    })
  }

  async crearDepartamento() {
    this.isOpen = true;
    const modal = await this.modalCtrl.create({
      component: CrearDepartamentoPage,
      cssClass: 'medium-modal',
      mode:'ios'
    });

    if (this.isOpen) {

      modal.present();
      const { data } = await modal.onWillDismiss();
 
      this.isOpen = false;
      if (data != undefined) {
        this.cargarDatos();

      }

    }
  }
  async editarDepartamento(departamento:Departamentos) {
    this.isOpen = true;
    const modal = await this.modalCtrl.create({
      component: EditarDepartamentoPage,
      cssClass: 'medium-modal',
      mode:'ios',
      componentProps:{
        departamento
      }
    });

    if (this.isOpen) {

      modal.present();
      const { data } = await modal.onWillDismiss();
      this.isOpen = false;
      if (data != undefined) {
        this.cargarDatos();

      }

    }
  }


  async borrarDepartamento(departamento:Departamentos){
    const alert = await this.alertCrl.create({
      subHeader:'D1',
      message:`¿Desea borrar el departamento ${departamento.nombre}?`,
      mode:'ios',
      buttons:[
        {
          text:'cancelar',
          role:'cancel',
          handler:()=>{
            console.log('cancel')
          }
        },
        {
          text:'continuar',
          role:'confirm',
          handler:async ()=>{
  this.alertasService.presentaLoading('Borrando datos..');
  this.departamentosService.syncDeleteDepartamentoToPromise(departamento.id).then( resp =>{
    this.alertasService.loadingDissmiss();
    this.departamentosService.syncGetDepartamentoToPromise().then(departamentos =>{
      this.cargarDatos();
    }, error =>{
      this.alertasService.loadingDissmiss();
      this.alertasService.message('D1','Lo sentimos algo salio mal...')
    })
  }, error =>{
    this.alertasService.loadingDissmiss();
    this.alertasService.message('D1','Lo sentimos algo salio mal...')
  })
          }
        }
      ]
    })
    alert.present();
  
    }
}
