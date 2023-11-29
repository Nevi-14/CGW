import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { EmpleadoSoland } from 'src/app/models/empleadoSofland';
 
import { UsuariosMatrizAcceso } from 'src/app/models/matrizAcceso';
import { UsuarioCentroCosto } from 'src/app/models/usuarioCentroCosto';
import { Usuarios } from 'src/app/models/usuarios';
import { AlertasService } from 'src/app/services/alertas.service';
import { CompaniasService } from 'src/app/services/companias.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { MatrizAccesoService } from 'src/app/services/matriz-acceso.service';
import { UsuarioCentrosCostosService } from 'src/app/services/usuario-centros-costos.service';
import { UsuariosMatrizAccesoService } from 'src/app/services/usuarios-matriz-acceso.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
interface data {
  id:any,
  valor:any, 
 }
@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.page.html',
  styleUrls: ['./crear-usuario.page.scss'],
})
export class CrearUsuarioPage implements OnInit {
  usuarioSeleccionado:Boolean = false;
  usuarioConfirmado:Boolean = false;
  codCompania = null;
  codDepartamento = null;
  usuario:Usuarios  = {
    id : null,
      usuario:null,
      web:false,
      aprobador:false,
       nombre:null,
       apellido:null,
       departamento:null,
      clave: null,
      correo:null,
      telefono:null,
      estatus:true,
      fecha:new Date(),
      seleccionado:null
    
  }
  textoBuscar = '';
  centro:UsuarioCentroCosto = { 
    id: null,
    usuario: null,
    coD_COMPANIA: null,
    centrO_COSTO: null,
    principal: true
  }
  roles:[] = [];
  matriz = [];
  multiple:boolean = true;
  companias:any[] = [];
  departamentos:any[] = [];
  usuarios:EmpleadoSoland[] = [];
  usuarioSofland:EmpleadoSoland = null;
  true = true;
  constructor(
public usuariosService:UsuariosService,
public alertasService:AlertasService,
public modalCtrl:ModalController,
public matrizAccesoService:MatrizAccesoService,
public usuariosMatrizAccesoService:UsuariosMatrizAccesoService,
public companiasService:CompaniasService,
public departamentoService:DepartamentosService,
public cd:ChangeDetectorRef,
public usuariosCentroCostoService:UsuarioCentrosCostosService

  ) { }

 async  ngOnInit() {
let matriz =  await this.matrizAccesoService.syncGetMatrizAccesotoToPromise();
this.matriz = await this.retornarArreglo(matriz,'iD_MATRIZ_ACCESO','nombre');
   console.log(this.matriz)
   this.companiasService.syncGetCompaniasToPromise().then((companias) => {
    companias.forEach((cliente, index) => {
      let compania = {
        id: cliente.nombre,
        valor: cliente.nombre,
      };
      this.companias.push(compania);
      if (index == companias.length - 1) {
       
      }
    });
  });

  }
  async retornarArreglo(array:any[],id:string,valor:string){
    let data:data[] = [];
     array.forEach((element, index) => {  
      console.log(element)
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

 async compania(form: NgForm) {
  // this.adelantoViatico.coD_COMPANIA = $event.detail.value;
  console.log(form.value)
  this.departamentos = [];
  this.usuarios = [];
  this.alertasService.presentaLoading('Cargando departamentos..')
  this.codCompania = form.value.coD_COMPANIA;
  this.departamentoService.syncGetDepartamentosSofland(form.value.coD_COMPANIA).then((departamentos) => {
    departamentos.forEach((dep, index) => {
      let departamento = {
        id: form.value.coD_COMPANIA  == 'COOK' ? dep.departamentO1 : dep.departamento,
        valor: dep.descripcion,
      };
      this.departamentos.push(departamento);
      if (index == departamentos.length - 1) {
        this.alertasService.loadingDissmiss();
       
      }
    });
  }, error =>{
    this.alertasService.loadingDissmiss();
    this.alertasService.message('D1', 'Lo sentimos algo salio mal');
  })
 

 }
 onSearchChange(event){
  console.log(event.detail.value)
  this.textoBuscar = event.detail.value;
 }
 async departamento(form: NgForm) {
  if(this.usuarioConfirmado)  return 
  console.log(form.value)
  this.usuarios = [];
  this.alertasService.presentaLoading('Cargando usuarios..')
  this.codDepartamento = form.value.departamento;
  this.usuariosService.syncGetUsuariosSofland(form.value.coD_COMPANIA,form.value.departamento).then((usuarios) => {
    this.usuarios = usuarios;
    this.alertasService.loadingDissmiss();
    if(this.usuarios.length == 0){
      this.alertasService.message('D1', 'No hay usuarios en este departamento');
    }
    console.log(this.usuarios)
  }, error =>{
    this.alertasService.loadingDissmiss();
    this.alertasService.message('D1', 'Lo sentimos algo salio mal');
  })


 }
 usuarioIonChange($event){
  console.log($event)
  this.usuarioSeleccionado = true;
  let usuario =  this.usuarios.filter(usuario => usuario.identificacion == $event.detail.value)[0];
this.usuarioSofland = usuario;
  console.log(usuario,'usuario')
 }
 crearUsuario(form:NgForm){
let data = form.value;
if(!this.usuarioSeleccionado){
  this.alertasService.message('D1', 'Seleciona un usuario para continuar!.')
  return
}

console.log(data,'data') 
this.usuario.nombre = data.nombre;


this.usuario.usuario = this.usuarioSofland.identificacion;
this.usuario.nombre = this.usuarioSofland.nombrE_PILA;
this.usuario.apellido = this.usuarioSofland.primeR_APELLIDO + ' ' + this.usuarioSofland.segundO_APELLIDO;
this.usuario.correo = data.correo;
this.usuario.clave = data.clave;
this.usuario.telefono = data.telefono;
this.centro.usuario = this.usuarioSofland.identificacion;
this.centro.coD_COMPANIA = this.codCompania;
this.centro.centrO_COSTO = this.usuarioSofland.centrO_COSTO;
if(!this.usuarioConfirmado) {
 // this.usuario.web = true; this.cd.detectChanges();
    this.usuarioConfirmado = true;
    let indexD = this.departamentos.findIndex(departamento => departamento.id == this.codDepartamento);
    if(indexD >= 0){
      this.usuario.departamento = this.departamentos[indexD].valor;
    }
    return


}

if(data.roles){
  this.roles = data.roles
}
this.alertasService.presentaLoading('guardando cambios..')
this.usuariosService.syncPostUsuarioToPromise(this.usuario).then((resp:Usuarios) =>{
this.usuariosCentroCostoService.syncPostUsuarioCentroCostoToPromise(this.centro).then((resp:UsuarioCentroCosto) =>{
  console.log('post user',resp)
  console.log('post roles',this.roles)
  console.log('data', data)
  if(!data.roles){
    this.alertasService.loadingDissmiss();
    this.modalCtrl.dismiss(true);
    this.alertasService.message('D1', 'usuario Creado')
    return
  }
this.roles.forEach(async (role, index) =>{
let rod:UsuariosMatrizAcceso = {
  id:null,
  iD_ONE_MATRIZ_ACCESO: role,
  iD_USUARIO: resp.id
}
console.log(rod)
await  this.usuariosMatrizAccesoService.syncPostUsuarioMatrizAccesoToPromise(rod);
if(index == this.roles.length -1){


    this.alertasService.loadingDissmiss();
    this.modalCtrl.dismiss(true);
    this.alertasService.message('D1', 'usuario Creado')




}
})

})
      

 

    
    }, error =>{
      console.log(error)
      this.alertasService.loadingDissmiss();
      this.alertasService.message('D1', 'Lo sentimos algo salio mal')
    })
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }
}
