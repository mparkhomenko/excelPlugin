import * as Excel from 'exceljs';

export async function readFile() {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile('excel.xlsx').then(function() {
        let worksheet = workbook.getWorksheet('Trello Sheet');

        let row = worksheet.lastRow;
        let getLastRowValue = row?.values;
        console.log(getLastRowValue);
    });
};