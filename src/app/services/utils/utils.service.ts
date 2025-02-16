import {Injectable} from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

declare var require;
const Swal = require('sweetalert2');

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    hoveredRegion;

    constructor() {
    }

    loaderActive = false;

    /**
     * Shows a Swal message with a given title, message, and type
     */
    showSwalMessage(title, message, type = 'success') {
        Swal.fire(
            title,
            message,
            type,
        );
    }

    /**
     * Exports data in Excel format
     */
    public exportAsExcelFile(yem: any[] | null, syr: any[] | null, excelFileName: string) {
        const mapData = (data: any[] | null) => {
            if (!data) return []; // Restituisce un array vuoto se i dati sono null
            return data.map(item => ({
                'DATE': item.date,
                'FCS_PEOPLE': item.metrics.fcs.people,
                'FCS_PREVALENCE': item.metrics.fcs.prevalence,
                'RCSI_PEOPLE': item.metrics.rcsi.people,
                'RCSI_PREVALENCE': item.metrics.rcsi.prevalence,
                'CFII': item.cfii,
            }));
        };

        const yemData = mapData(yem);
        const syrData = mapData(syr);

        const workbook: XLSX.WorkBook = {
            Sheets: {},
            SheetNames: []
        };

        if (yemData?.length > 0) {
            workbook.Sheets['Yemen'] = XLSX.utils.json_to_sheet(yemData);
            workbook.SheetNames.push('Yemen');
        }

        if (syrData?.length > 0) {
            workbook.Sheets['Syria'] = XLSX.utils.json_to_sheet(syrData);
            workbook.SheetNames.push('Syria');
        }

        if (workbook.SheetNames.length === 0) {
            console.error('No data available for export.');
            return;
        }

        const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});

        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    }
}
