import { Component } from '@angular/core';
import { CrearMatrizAccesoPage } from '../crear-matriz-acceso/crear-matriz-acceso.page';
import { AlertController, ModalController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import { MatrizAccesoService } from 'src/app/services/matriz-acceso.service';
import { EditarMatrizAccesoPage } from '../editar-matriz-acceso/editar-matriz-acceso.page';
import { ModulosService } from 'src/app/services/modulos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { MatrizAccesoView } from 'src/app/models/matrizAccesoView';
import { ModulosMatrizAccesoService } from 'src/app/services/modulos-matriz-acceso.service';
import { ExcelService } from 'src/app/services/excel.service';
import { Modulos } from 'src/app/models/modulos';
interface Filtros {
  nombre: any;
  filtro: any;
}

@Component({
  selector: 'app-control-matriz-acceso',
  templateUrl: './control-matriz-acceso.page.html',
  styleUrls: ['./control-matriz-acceso.page.scss'],
})
export class ControlMatrizAccesoPage {
  isOpen: boolean = false;
  data: MatrizAccesoView[] = [];
  temp = [];
  modulos: Modulos[] = [];
  pageSize = 6;
  currentPage = 1;
  filtro: Filtros = { nombre: 'Nombre', filtro: 'nombre' };
  filtros: any = [
    {
      label: 'Id',
      type: 'radio',
      value: { nombre: 'Id', filtro: 'iD_MATRIZ_ACCESO' },
    },
    {
      label: 'Nombre',
      type: 'radio',
      value: { nombre: 'Nombre', filtro: 'nombre' },
    },
  ];

  constructor(
    public modalCtrl: ModalController,
    public alertasService: AlertasService,
    public matrizAccesoService: MatrizAccesoService,
    public modulosService: ModulosService,
    public alertCrl: AlertController,
    public usuariosService: UsuariosService,
    public modulosMatrizAccesoService: ModulosMatrizAccesoService,
    public excelService: ExcelService
  ) {}

  // Method to load data
   cargarDatos() {
     this.alertasService.presentaLoading('Cargando datos...');
    this.modulosService.syncGetModulosToPromise().then(
      (modulos) => {
        this.modulosService.modulos = modulos;
        this.matrizAccesoService.syncGetMatrizAccesotoToPromise().then(
           (res) => {
           this.alertasService.loadingDissmiss();
            this.temp = [...res];
            this.data = res;
          },
           (error) => {
              this.alertasService.loadingDissmiss();
            this.alertasService.message(
              'D1',
              'Error cargando matriz de acceso..'
            );
          }
        );
      },
      (error) => {
         this.alertasService.loadingDissmiss();
        this.alertasService.message('D1', 'Error cargando módulos..');
      }
    );
  }

  // Method to update filter
  updateFilter(event, filtro: Filtros) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return d[filtro.filtro].toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.data = temp;
  }

  // Method to display filter options
  async filtrarData() {
    const alert = await this.alertCrl.create({
      header: 'Opciones de filtro',
      mode: 'ios',
      buttons: [
        { text: 'Cancel', role: 'cancel', handler: () => {} },
        {
          text: 'OK',
          role: 'confirm',
          handler: (data: Filtros) => {
            this.filtro = data;
          },
        },
      ],
      inputs: this.filtros,
    });
    await alert.present();
  }

  // Method to export data to Excel
  descargarDatos() {
    this.excelService.exportToExcel(
      this.data.filter((e) => e.seleccionado == true).length > 0
        ? this.data.filter((e) => e.seleccionado == true)
        : this.data,
      'ControlAcceso'
    );
  }

  // Getter for total pages
  get totalPages(): number {
    return Math.ceil(this.data.length / this.pageSize);
  }

  // Method to edit an element
  editarElemento(row: MatrizAccesoView) {
    this.modulos = [];
    let i = this.data.findIndex(
      (e) => e.iD_MATRIZ_ACCESO == row.iD_MATRIZ_ACCESO
    );
    if (i >= 0) {
      this.EditarMatrizAcceso(this.data[i]);
    }
  }

  // Method to delete an element
  borrarElemento(row) {
    let i = this.data.findIndex(
      (e) => e.iD_MATRIZ_ACCESO == row.iD_MATRIZ_ACCESO
    );
    if (i >= 0) {
      this.borrarMatrizAcceso(this.data[i]);
    }
  }

  // Lifecycle hook - called when the component is about to be displayed
  ionViewWillEnter() {
    this.cargarDatos();
  }

  // Method to create a new Matriz Acceso
  async crearMatrizAcceso() {
    this.isOpen = true;
    const modal = await this.modalCtrl.create({
      component: CrearMatrizAccesoPage,
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

  // Method to edit a Matriz Acceso
  async EditarMatrizAcceso(acceso1: MatrizAccesoView) {
    let acceso =
      await this.matrizAccesoService.syncGetMatrizAccesoIDtoToPromise(
        acceso1.iD_MATRIZ_ACCESO
      );
    let modulosArray =
      await this.modulosMatrizAccesoService.syncGetModulosMatrizAccesoByIDtoToPromise(
        acceso1.iD_MATRIZ_ACCESO
      );

    if (!this.isOpen) {
      this.alertasService.presentaLoading('Cargando datos..');
      this.modulosService.syncGetModulosToPromise().then(
        async (modulos) => {
          this.modulos = modulos;

          this.alertasService.loadingDissmiss();
          if (modulosArray.length == 0) {
            this.editarMatriz(acceso[0]);
          }
          modulosArray.forEach(async (modulo, index) => {
            let iM = this.modulos.findIndex((e) => e.id == modulo.iD_MODULO);
            if (iM >= 0) {
              this.modulos[iM].seleccionado = true;
            }
            if (index == modulosArray.length - 1) {
              this.editarMatriz(acceso[0]);
            }
          });
        },
        (error) => {
          this.alertasService.loadingDissmiss();
          this.alertasService.message('D1', 'Lo sentimos algo salió mal..');
        }
      );
    }
  }

  // Method to edit the Matriz Acceso
  async editarMatriz(acceso) {
    this.isOpen = true;
    const modal = await this.modalCtrl.create({
      component: EditarMatrizAccesoPage,
      cssClass: 'medium-modal',
      mode: 'ios',
      componentProps: {
        acceso,
        modulos: this.modulos,
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

  // Method to delete a Matriz Acceso
  async borrarMatrizAcceso(acceso1: MatrizAccesoView) {
    const alert = await this.alertCrl.create({
      subHeader: 'D1',
      message: `¿Desea borrar el acceso  ${acceso1.nombre}?`,
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
            this.matrizAccesoService
              .syncDeleteMatrizAccesoToPromise(acceso1.iD_MATRIZ_ACCESO)
              .then(
                (resp) => {
                  this.alertasService.loadingDissmiss();
                  this.cargarDatos();
                },
                (error) => {
                  this.alertasService.loadingDissmiss();
                  this.alertasService.message(
                    'D1',
                    'Error borrando el acceso..'
                  );
                }
              );
          },
        },
      ],
    });
    alert.present();
  }

  // Getter for paginated data
  get paginatedData(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.data.slice(startIndex, startIndex + this.pageSize);
  }

  // Method to go to the next page
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Method to go to the previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Method to select/deselect all items
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
