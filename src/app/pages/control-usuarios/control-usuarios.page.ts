import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CrearUsuarioPage } from '../crear-usuario/crear-usuario.page';
import { EditarUsuarioPage } from '../editar-usuario/editar-usuario.page';
import { Usuarios } from 'src/app/models/usuarios';
import { UsuariosMatrizAccesoService } from 'src/app/services/usuarios-matriz-acceso.service';
import { MatrizAccesoService } from 'src/app/services/matriz-acceso.service';
import { ExcelService } from 'src/app/services/excel.service';
import { UsuarioCentrosCostosService } from 'src/app/services/usuario-centros-costos.service';

interface filtros {
  nombre: any;
  filtro: any;
}

interface data {
  id: any;
  valor: any;
}

@Component({
  selector: 'app-control-usuarios',
  templateUrl: './control-usuarios.page.html',
  styleUrls: ['./control-usuarios.page.scss'],
})
export class ControlUsuariosPage {
  isOpen: boolean = false;
  public data: any[] = [];
  temp = [];
  matriz: data[] = [];
  pageSize = 6;
  currentPage = 1;
  filtro: filtros = { nombre: 'Nombre', filtro: 'nombre' };
  filtros: any = [
    {
      label: 'Usuario',
      type: 'radio',
      value: { nombre: 'Usuario', filtro: 'usuario' },
    },
    {
      label: 'Nombre',
      type: 'radio',
      value: { nombre: 'Nombre', filtro: 'nombre' },
    },
    {
      label: 'Apellido',
      type: 'radio',
      value: { nombre: 'Apellido', filtro: 'apellido' },
    },
  ];

  constructor(
    public usuariosService: UsuariosService,
    public alertasService: AlertasService,
    public modalCtrl: ModalController,
    public alertCrl: AlertController,
    public usuarioMatrizAccesoService: UsuariosMatrizAccesoService,
    public matrizAccesoService: MatrizAccesoService,
    public excelservice: ExcelService,
    public centroCostosService: UsuarioCentrosCostosService
  ) {}

  // Load user data
  cargarDatos() {
    this.alertasService.presentaLoading('Cargando datos...');
    this.usuariosService.syncGetUsuariosToPromise().then(
      (res) => {
        this.alertasService.loadingDissmiss();
        this.temp = [...res];
        this.data = res;
      },
      (error) => {
        this.alertasService.loadingDissmiss();
        this.alertasService.message('D1', 'Error cargando usuarios...');
      }
    );
  }

  // Lifecycle hook when the page is about to enter
  ionViewWillEnter() {
    this.cargarDatos();
  }

  // Update filter based on user input
  updateFilter(event, filtro: filtros) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return d[filtro.filtro].toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.data = temp;
  }

  // Show filter options in an alert
  async filtrarData() {
    const alert = await this.alertCrl.create({
      header: 'Opciones de filtro',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: (data: filtros) => {
            this.filtro = data;
          },
        },
      ],
      inputs: this.filtros,
    });

    await alert.present();
  }

  // Export data to Excel
  descargarDatos() {
    this.excelservice.exportToExcel(
      this.data.filter((e) => e.seleccionado == true).length > 0
        ? this.data.filter((e) => e.seleccionado == true)
        : this.data,
      'ControlUsuarios'
    );
  }

  // Get total pages for pagination
  get totalPages(): number {
    return Math.ceil(this.data.length / this.pageSize);
  }

  // Edit user element
  editarElemento(row) {
    let i = this.data.findIndex((e) => e.id == row.id);
    if (i >= 0) {
      this.editarUsuario(this.data[i]);
    }
  }

  // Delete user element
  borrarElemento(row) {
    let i = this.data.findIndex((e) => e.id == row.id);
    if (i >= 0) {
      this.borrarUsuario(this.data[i]);
    }
  }

  // Create a new user
  async crearUsuario() {
    this.isOpen = true;

    const modal = await this.modalCtrl.create({
      component: CrearUsuarioPage,
      cssClass: 'medium-modal',
      mode: 'ios',
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

  // Edit user details
  async editarUsuario(usuario: Usuarios) {
    let rolesArray = await this.usuarioMatrizAccesoService.syncGetUsuariosMatrizAccesoByIDtoToPromise(
      usuario.id
    );
    let roles = [];
    if (rolesArray.length == 0) {
      this.editaUsuario(usuario, roles[0]);
    }
    rolesArray.forEach(async (role, index) => {
      roles.push(role.iD_ONE_MATRIZ_ACCESO);
      if (index == rolesArray.length - 1) {
        this.editaUsuario(usuario, roles);
      }
    });
  }

  // Convert model to data type
  async retornarArreglo(array: any[], id: string, valor: string) {
    let data: data[] = [];
    array.forEach((element, index) => {
      let item = {
        id: element[id],
        valor: element[valor],
      };
      data.push(item);

      if (index == array.length - 1) {
        return data;
      }
    });

    return data;
  }

  // Edit user details (continue)
  async editaUsuario(usuario, roles) {
    let matriz = await this.matrizAccesoService.syncGetMatrizAccesotoToPromise();
    this.matriz = await this.retornarArreglo(matriz, 'iD_MATRIZ_ACCESO', 'nombre');
    this.isOpen = true;

    const modal = await this.modalCtrl.create({
      component: EditarUsuarioPage,
      cssClass: 'medium-modal',
      mode: 'ios',
      componentProps: {
        usuario,
        roles,
        matriz: this.matriz,
      },
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

  // Delete user
  async borrarUsuario(usuario: Usuarios) {
    const alert = await this.alertCrl.create({
      subHeader: 'D1',
      message: `¿Desea borrar el usuario ${usuario.nombre}?`,
      mode: 'ios',
      buttons: [
        {
          text: 'cancelar',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'continuar',
          role: 'confirm',
          handler: async () => {
            this.alertasService.presentaLoading('Borrando datos..');
            this.usuariosService.syncDeleteUsuarioToPromise(usuario.id).then(
              (resp) => {
                this.centroCostosService.syncDeleteUsuarioCentroCostoToPromise(
                  usuario.usuario
                ).then(
                  (resp) => {
                    this.alertasService.loadingDissmiss();
                    this.cargarDatos();
                  },
                  (error) => {
                    this.alertasService.loadingDissmiss();
                    this.alertasService.message(
                      'D1',
                      'Lo sentimos algo salio mal...'
                    );
                  }
                );
              },
              (error) => {
                this.alertasService.loadingDissmiss();
                this.alertasService.message(
                  'D1',
                  'Lo sentimos algo salio mal...'
                );
              }
            );
          },
        },
      ],
    });
    alert.present();
  }

  // Paginated data

  // Get paginated data for the current page
  get paginatedData(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.data.slice(startIndex, startIndex + this.pageSize);
  }

  // Go to the next page
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Go to the previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Select or deselect all items
  selectAll(event) {
    if (event.detail.checked) {
      this.data.forEach((item) => {
        item.seleccionado = true;
      });
    } else {
      this.data.forEach((item) => {
        item.seleccionado = false;
      });
    }
  }
}
