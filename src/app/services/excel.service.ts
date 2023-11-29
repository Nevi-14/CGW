import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx'; // npm install xlsx --save && npm install file-saver --save
import { Filesystem, Directory } from '@capacitor/filesystem'; // npm i @capacitor/filesystem --save  -- npm i @ngtools/webpack --save
import { FileOpener } from '@ionic-native/file-opener/ngx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(
    public fileOpener: FileOpener   
  ) { }


  

  async exportToExcel(data, filename) {
    {
      console.log(data, 'data to rxporttt')
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, filename);
      // console.log('XLSX',XLSX.writeFile(wb, filename + '.xlsx'))
      console.log('XLSX', XLSX)

      // XLSX.write(wb, { type: 'base64' });
      XLSX.writeFile(wb, filename + '.xlsx')


    }



  }
  async saveExcel(base64URL) {
    let path = `excel/reporte_${Date.now()}.xlsx`;
    const saveFile = await Filesystem.writeFile({
      path,
      data: base64URL,
      directory: Directory.Documents,
      recursive: true

    })

    this.fileOpener.open(saveFile.uri, 'application/vnd.ms-excel')
  }

}
