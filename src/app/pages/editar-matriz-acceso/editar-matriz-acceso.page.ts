import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { OneUsuariosModulosMatrizAccesoView } from 'src/app/models/OneUsuariosModulosMatrizAccesoView';
import { MatrizAcceso } from 'src/app/models/matrizAcceso';
import { AlertasService } from 'src/app/services/alertas.service';
import { CompaniasService } from 'src/app/services/companias.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { MatrizAccesoService } from 'src/app/services/matriz-acceso.service';
import { ModulosMatrizAccesoService } from 'src/app/services/modulos-matriz-acceso.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
interface data {
  id:any,
  valor:any, 
 }
@Component({
  selector: 'app-editar-matriz-acceso',
  templateUrl: './editar-matriz-acceso.page.html',
  styleUrls: ['./editar-matriz-acceso.page.scss'],
})
export class EditarMatrizAccesoPage implements OnInit {
  @Input()companias:data[] 
  @Input()departamentos:data[] ;
  @Input()modulos:data[]
  @Input() acceso: MatrizAcceso
  @Input() editarModulos:[]
  multiple = true;
  total = 0;
  usuarios:OneUsuariosModulosMatrizAccesoView[]=[]
  constructor(
    public modalCtrl: ModalController,
    public modulosService: ModulosService,
    public companiaService: CompaniasService,
    public departamentosService: DepartamentosService,
    public alertasService: AlertasService,
    public usuariosService: UsuariosService,
    public matrizAccesoService:MatrizAccesoService,
    public cd: ChangeDetectorRef,
    public modulosMatrizccesoService:ModulosMatrizAccesoService
  ) { }



  ngOnInit() {
    console.log(this.acceso,'acceso')
 console.log(this.editarModulos,'editarModulos')
 console.log(this.companias,'companias')
 console.log(this.departamentos,'departamentos')
 console.log(this.modulos,'modulos')
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
  borrarModulo($event){
    console.log($event)
      }
      onChangeCompania(formulario:NgForm, $event){
        console.log('formulario',formulario)
console.log('fformulario', formulario.value.compania)
this.acceso.iD_COMPANIA = formulario.value.compania;
this.cd.detectChanges();
      }
 async  editarRolAcceso(fAcceso:NgForm){

let data = fAcceso.value;
console.log(data,'data')
console.log(this.acceso,'acceso')
let modulos = data.modulos;
this.acceso.id = data.id;
this.acceso.iD_COMPANIA = data.compania;
this.acceso.iD_DEPARTAMENTO = data.departamento;
this.acceso.nombre = data.nombre;

  await this.modulosMatrizccesoService.syncDeleteModuloMatrizAccesoToPromise(this.acceso.id);

    this.alertasService.presentaLoading('Guardando cambios..');
    this.matrizAccesoService.syncPutMatrizAccesoToPromise(this.acceso).then(resp =>{
      this.alertasService.loadingDissmiss();
      this.matrizAccesoService.syncGetMatrizAccesotoToPromise().then(accesos =>{
        this.matrizAccesoService.matrizAcceso = accesos;
        if(modulos.length == 0){
          this.alertasService.message('Dione','Acceso actualizado');    
          this.modalCtrl.dismiss(true)
          
        }

        modulos.forEach(async (modulo, index) =>{
          let mod = {
             id:null,
             iD_MATRIZ_ACCESO: this.acceso.id,
             iD_MODULO: modulo
          }
          console.log(mod)
         await  this.modulosMatrizccesoService.syncPostModuloMatrizAccesoToPromise(mod);
          if(index == modulos.length -1){
            this.alertasService.message('Dione','Acceso actualizado');    
            this.modalCtrl.dismiss(true)
          }
        })


      }, error =>{
        this.alertasService.loadingDissmiss();
        this.alertasService.message('Dione','Lo sentimos algo salio mal..');
      })
    }, error =>{
      this.alertasService.loadingDissmiss();
      this.alertasService.message('Dione','Lo sentimos algo salio mal..');
    })
  }

}
