import * as Excel from 'exceljs';

export async function createFile() {
    const workbook = new Excel.Workbook();
    workbook.addWorksheet("Trello Sheet");
    await workbook.xlsx.writeFile('excel.xlsx');
};