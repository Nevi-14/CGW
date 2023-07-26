import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MatrizAcceso } from 'src/app/models/matrizAcceso';
import { Usuarios } from 'src/app/models/usuarios';
import { AlertasService } from 'src/app/services/alertas.service';
import { CompaniasService } from 'src/app/services/companias.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { MatrizAccesoService } from 'src/app/services/matriz-acceso.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ModulosMatrizAccesoService } from 'src/app/services/modulos-matriz-acceso.service';
import { NgForm } from '@angular/forms';
interface data {
  id:any,
  valor:any, 
 }
@Component({
  selector: 'app-crear-matriz-acceso',
  templateUrl: './crear-matriz-acceso.page.html',
  styleUrls: ['./crear-matriz-acceso.page.scss'],
})
export class CrearMatrizAccesoPage implements OnInit {
acceso:MatrizAcceso = {
   id:null,
   iD_COMPANIA: null,
   iD_DEPARTAMENTO: null,
   nombre: null,
   estatus: true,
   aprobador: false,
   c: false,
   r: true,
   u: false,
   d: false
}
companias:data[] = [];
departamentos:data[] = [];
modulos:data[]=[]
crearModulos = [];
multiple:boolean = true;
  constructor(
    public modalCtrl: ModalController,
    public modulosService: ModulosService,
    public companiaService: CompaniasService,
    public departamentosService: DepartamentosService,
    public alertasService: AlertasService,
    public usuariosService: UsuariosService,
    public matrizAccesoService:MatrizAccesoService,
    public modulosMatrizccesoService:ModulosMatrizAccesoService
  ) { }

  ngOnInit() {
    this.alertasService.presentaLoading('Cargando datos..');
    this.modulosService.syncGetModulosToPromise().then(async (modulos) => {

       
      this.modulos = this.modulos.concat(await this.retornarArreglo(modulos,'id','nombre'));
      this.companiaService.syncGetCompaniasToPromise().then(async (companias) => {
        this.companias = this.companias.concat(await this.retornarArreglo(companias,'id','nombre'));
        this.departamentosService.syncGetDepartamentoToPromise().then(async (departamentos) => {
          this.departamentos = this.departamentos.concat(await this.retornarArreglo(departamentos,'id','nombre'));
          this.alertasService.loadingDissmiss();
          console.log('modulos', this.modulosService.modulos);
          console.log('companias', this.companiaService.companias)
          console.log('departamentos', this.departamentosService.departamentos);
 

        }, error => {
          this.alertasService.loadingDissmiss();
          this.alertasService.message('Dione', 'Lo sentimos algo salio mal..')
        })
      }, error => {
        this.alertasService.loadingDissmiss();
        this.alertasService.message('Dione', 'Lo sentimos algo salio mal..')
      })
    }, error => {
      this.alertasService.loadingDissmiss();
      this.alertasService.message('Dione', 'Lo sentimos algo salio mal..')
    })
  }
  async retornarArreglo(array:any[],id:string,valor:string){
     let data:data[] = [];
      array.forEach((element, index) => {  
        let item = {
          id : element[id],
          valor: element[valor]
         };
          data.push(item) 

          if(index == array.length -1){
            return data;
          }
      });

      return data
  }

  cerrarModal() {
    this.modalCtrl.dismiss();

  }


  crearRolAcceso(fAcceso:NgForm){
    let data = fAcceso.value;
    let modulos = data.modulos;
    this.acceso.id = data.id;
    this.acceso.iD_COMPANIA = data.compania;
    this.acceso.iD_DEPARTAMENTO = data.departamento;
    this.acceso.nombre = data.nombre;

    console.log(this.acceso, 'acceso')
    //console.log(modulos, 'modulos')
    //console.log(data, 'data')
   
    this.alertasService.presentaLoading('Guardando cambios..');
    this.matrizAccesoService.syncPostMatrizAccesoToPromise(this.acceso).then( (resp:MatrizAcceso) =>{

      
    modulos.forEach(async (modulo, index) =>{
      let mod = {
         id:null,
         iD_MATRIZ_ACCESO: resp.id,
         iD_MODULO: modulo
      }
      console.log(mod)
     await  this.modulosMatrizccesoService.syncPostModuloMatrizAccesoToPromise(mod);
      if(index == modulos.length -1){
        this.alertasService.loadingDissmiss();
        this.alertasService.message('Dione', 'Role Creado')
        this.modalCtrl.dismiss(true)
      }
    })


    }, error =>{
      this.alertasService.loadingDissmiss();
      this.alertasService.message('Dione', 'Lo sentimos algo salio mal..')
    })
  
  }
}
