import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { adelantoViaticos } from 'src/app/models/adelantoViaticos';
import { AdelantoViaticosService } from 'src/app/services/adelanto-viaticos.service';
import { AlertasService } from '../../services/alertas.service';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-control-anticipos',
  templateUrl: './control-anticipos.page.html',
  styleUrls: ['./control-anticipos.page.scss'],
})
export class ControlAnticiposPage implements OnInit {
  isOpen: boolean = false;
  adelantoViaticosArray:adelantoViaticos[]=[];
  textoBuscar = "";
  @ViewChild(DatatableComponent) table: DatatableComponent;
  public columns: any;
  public rows: any[];
  multi:any ='multi';
  temp = [];
  constructor(
public modalCtrl: ModalController,
public adelantoViaticosService:AdelantoViaticosService,
public alertasService: AlertasService,
public router:Router,
public usuariosService: UsuariosService


  ) { }
  cargarDatos(){

    this.columns = [
      { id: "estatus", label: "Estatus", size: 2},
      { id: "coD_COMPANIA", label: "Compañia", size: 2 },
      { id: "fechA_INICIAL", label: "Fecha Inicial", size: 2 },
      { id: "fechA_FINAL", label: "Fecha Final", size: 2 },
      { id: "monto", label: "Monto", size: 2 },
      { id: "opciones", label: "Opciones", size: 2 }
  ];
  this.adelantoViaticosService.syncGetAdelantoViaticosToPromise()
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
    this.detalleAdeltanto(this.rows[i])
  }
}
borrarElemento(row) {
  let i = this.rows.findIndex( e => e.id == row.id);
  if(i >= 0){
    console.log('elemento',this.rows[i])
  }

  console.log(row,'borrarElemento');
}


 updateFilter(event) {
  const val = event.target.value.toLowerCase();

  // filter our data
  const temp = this.temp.filter(function (d) {
  //d.nombre, d.descripcion, etc..
  console.log('d',d)
    return d.coD_COMPANIA.toLowerCase().indexOf(val) !== -1 || !val;
  });

  // update the rows
  this.rows = temp;
  // Whenever the filter changes, always go back to the first page
  this.table.offset = 0;

}

  ngOnInit() {
    this.adelantoViaticosService.adelantoViatico  = null;
    this.cargarDatos();
  }
  onSearchChange(event){

    this.textoBuscar = event.detail.value;
      }
  async cargarDatos2(){
this.alertasService.presentaLoading('Cargando datos...');
this.adelantoViaticosService.syncGetAdelantoViaticosToPromise().then(resp =>{
 this.alertasService.loadingDissmiss();
  this.adelantoViaticosArray = resp;

}, error =>{
  this.alertasService.loadingDissmiss();
  this.alertasService.message('DIONE', 'Lo sentimos algo salio mal..')
})

  }

  correo(){
    this.alertasService.message('DIONE', 'La opción no se encuentra disponible..')
  }
  async adelantoViaticos(){

    this.router.navigateByUrl('/inicio/registro-anticipos', {replaceUrl:true});

  
    

  }

  async detalleAdeltanto(adelanto:adelantoViaticos){
    this.adelantoViaticosService.adelantoViatico = adelanto;
    this.router.navigateByUrl('inicio/detalle-anticipo')
  }
}
