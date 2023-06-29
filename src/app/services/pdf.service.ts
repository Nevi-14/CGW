import { Injectable } from '@angular/core';
import {PdfMakeWrapper} from 'pdfmake-wrapper';

import { HttpClient } from '@angular/common/http';
import { ColonesPipe } from '../pipes/colones.pipe';
 // npm i pdfmake-wrapper --save --dev
 // npm i pdfmake --save --dev
interface productsToAdd {
  id: number,
  total: number,
  units:number,
  subTotal: number,
  tax: number,
  taxPercentage: number,
  product: any

}


@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(
public http: HttpClient

  ) { }

  getFormattedDate(date) {


    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
  
    return day + '/' + month + '/' + year;
}


generatePDF( invoice:any, lines:any[]){

  this.http.get('assets/imgs/devCodingLogo.png', { responseType: 'blob' })
  .subscribe(res => {
    const reader = new FileReader();
    reader.onloadend = () => {
      var base64data = reader.result;                
          console.log(base64data);
 
         this.rellenarpdf(base64data, invoice, lines)
    }

    reader.readAsDataURL(res); 
    console.log(res);
  });

 
}


  async rellenarpdf(image,invoice:any, lines:any[]){

 
    

    const pdf = new PdfMakeWrapper();
    pdf.pageMargins(20);

    pdf.info({
      title:invoice.title,
      author: String(invoice.iD_USER),
      subject: 'Orden de compra',
  });

    let data = [];


    let header = {
      layout: 'noBorders', // optional
      table: {
      headerRows: 1,
      widths: [ '*', 'auto', 100, '*' ],
      body: [
        [ { image: image,width: 100},
          [
          { text: 'Dev-Coding'},
          { text: 'Factura Electrónica'},
          { text: invoice.title},
          { text: ''}

        ], '', this.getFormattedDate(new Date(invoice.requireD_DATE)) ],
        [{ text: '', margin: [ 10, 10, 10, 10 ]} , '' , '' , '', ],
        [   { text: 'País:', bold: true} , 'CR' , '' , '', ],
        [   { text: 'Forma de pago', bold: true} ,'' +'  Contado' , '' , '', ],
        [   { text: 'Moneda:', bold: true} , invoice.currency , '' , '', ],
        [   { text: 'Dirección:', bold: true} , '' , '' , '', ],
        [   { text:'Fecha de la Orden:', bold: true} , this.getFormattedDate(new Date(invoice.date)) , '' , '', ],
        [   { text: 'Fecha de Cotización:', bold: true} , this.getFormattedDate(new Date(invoice.quotatioN_DATE)) , '' , '', ],
        [   { text: 'Fecha Requerida:', bold: true} , this.getFormattedDate(new Date(invoice.requireD_DATE)) , '' , '', ],
    
        [     { text: 'Lista de Articulos',alignment: 'left',margin: [0, 10, 0, 10],bold: true}, '', '', '' ]
      ]
    }
    }

    let body = {
      layout: 'lightHorizontalLines', // optional
      table: {
      headerRows: 1,
      widths: [55, 115,60,60, 90,60 ],
      body: [
        ['','', 'Cantidad', 'Precio', 'Descuento','Importe'],
        ['Artículo','Descripción', 'Ordenada', 'Unitario', '%','Total']
      ]
    }
    }
    let montos = {
      layout: 'noBorders', // optional
      table: {
      headerRows: 1,
      widths: ['*', 'auto', '*', '*','*','*'],
      body: [
        ['','', '', '',  { text: 'Envio: ', bold: true},ColonesPipe.prototype.transform(invoice.shppinG_AMOUNT, 2 , '.' , ',' ,   invoice.currency)],
        ['','', '', '',  { text: 'Descuento: ', bold: true},ColonesPipe.prototype.transform(invoice.discounT_AMOUNT, 2 , '.' , ',' ,   invoice.currency)],
        ['','', '', '',  { text: 'SubTotal: ', bold: true},ColonesPipe.prototype.transform(invoice.suB_TOTAL, 2 , '.' , ',' ,   invoice.currency)],
        ['','', '', '',  { text: 'Total: ', bold: true},ColonesPipe.prototype.transform(invoice.total, 2 , '.' , ',' , invoice.currency)],
        [{ text: 'Instrucciones: ', bold: true},'', '', '',  '',''],
        [{ text: invoice.instructions},'', '', '',  '',''],
      ]
    }
    }




    for(let a =0; a < lines.length ; a++){

      body.table.body.push([ String(lines[a].id), lines[a].product.description, String(lines[a].units), ColonesPipe.prototype.transform(lines[a].product.price, 2 , '.' , ',' ,   invoice.currency),String(lines[a].taxPercentage) ,  ColonesPipe.prototype.transform(lines[a].total, 2 , '.' , ',' ,   invoice.currency)])
      if( a == lines.length -1){

  
        pdf.add(
          [
          header,
          body,
          montos,
          { text: 'Código QR: ', bold: true, margin: [ 0, 20, 0, 20 ] },
          { qr: String('https://isa-app.dev/product-catalog/web/facturacion-digital/invoice-url/'+invoice.id) , margin :0}
        ]
      
        );
        pdf.create().download(invoice.title);
    

      }
    }


    return



  }


}
