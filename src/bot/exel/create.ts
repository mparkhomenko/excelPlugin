import * as Excel from 'exceljs';

export async function createFile(fileName:string) {
    const workbook = new Excel.Workbook();
    workbook.addWorksheet("Sheet");
    await workbook.xlsx.writeFile(fileName + '.xlsx');
};