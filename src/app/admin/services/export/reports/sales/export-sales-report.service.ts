import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { IOrdersReportFilters } from 'src/app/admin/interfaces/reports/orders/order_rerport.filters';
import { OrdersReportsService } from '../../../reports/orders/orders-reports.service';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import * as moment from 'moment';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class ExportSalesReportService {

  constructor(
    private ordersReportsService: OrdersReportsService
  ) { }
  ordersGroupedBySaource: any[] = [];

  //Start orders sold grouped by saources
  createPdfOrdersGroupedBySaource(filters: IOrdersReportFilters) {

    filters.start_date == '' ?
      filters.start_date = 'el inicio' :
      filters.start_date = moment(filters.start_date).format('YYYY-MM-DD')

    filters.end_date == '' ?
      filters.end_date = 'la actualidad' :
      filters.end_date = moment(filters.end_date).format('YYYY-MM-DD')


    let docDefinition = {
      content: [
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ['auto', 'auto', '20%', '20%', '30%'],
            body: this.ordersGroupedBySaource
          }
        }
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          alignment: 'center'

        },
        content: {
          fontSize: 14,
          alignment: 'center'
        }
      },
      pageOrientation: 'landscape',
    };


    pdfMake.createPdf(docDefinition).download(`Ventas agrupadas por platillo del ${filters.start_date} al ${filters.end_date}`);

  }
  exportPdfOrdersGroupedBySaource(filters: IOrdersReportFilters) {
    this.ordersGroupedBySaource = []
    switch (filters.format) {
      case 'PDF':
        this.getOrdersGroupedBySaource(filters)
        break;
      default:
        break;
    }
  }
  getOrdersGroupedBySaource(filters: IOrdersReportFilters) {
    this.ordersReportsService.getOrdersReport(filters)
      .subscribe({

        next: (res: IResponse) => {

          console.log('getOrders next res', res);

          if (res.result) {

            //Create the header table with styles
            const header = [

              { text: 'Id', fontSize: 12, bold: true, alignment: 'center' },
              { text: 'Platillo', fontSize: 12, bold: true, alignment: 'center' },
              { text: 'Cantidad Vendida', fontSize: 12, bold: true, alignment: 'center' },
              { text: 'Total vendido', fontSize: 12, bold: true, alignment: 'center' },
              { text: 'Total correspondiente a los ingresos del periodo', fontSize: 12, bold: true, alignment: 'center' }
            ]

            //Create the rows for the table with the styles 
            this.ordersGroupedBySaource.push(header)
            res.data.sales.map((element: any) => {
              let aux = [
                {
                  text: element.id,
                  style: 'content'
                },
                {
                  text: element.name,
                  style: 'content'
                },
                {
                  text: `${element.sales_amount} pzas`,
                  style: 'content'
                },
                {
                  text: element.total_sold,
                  style: 'content'
                },
                {
                  text: `${element.equivalent_in_percentage} %`,
                  style: 'content'
                },

              ]
              this.ordersGroupedBySaource.push(aux)
            })

            //Create the pdf file
            this.createPdfOrdersGroupedBySaource(filters)
          }

        },
        error: (res: any) => {
          console.log('getOrders error res', res);
          this.ordersGroupedBySaource = []



        }


      })
  }
  //End orders sold grouped by saources

}
