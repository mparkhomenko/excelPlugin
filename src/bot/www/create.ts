import * as Excel from 'exceljs';

export async function createFile() {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Trello Sheet");

    worksheet.columns = [
        {header: 'Id', key: 'id', width: 10},
        {header: 'Name', key: 'name', width: 32},
        {header: 'D.O.B.', key: 'dob', width: 15},
    ];
    worksheet.addRow({id: 3, name: 'New Guy 1', dob: new Date(2000, 1, 1)});
    worksheet.addRow({id: 4, name: 'New Guy 2', dob: new Date(2000, 1, 1)});
    worksheet.addRow({id: 5, name: 'New Guy 3', dob: new Date(2000, 1, 1)});
    worksheet.addRow({id: 6, name: 'New Guy 4', dob: new Date(2000, 1, 1)});

    await workbook.xlsx.writeFile('excel.xlsx');
};