import * as Excel from 'exceljs';
import fetch from 'node-fetch';

export async function readFile() {
    const workbook = new Excel.Workbook();
    const organizationId = '5e95c935374008195a3df6c5';
    const key = '6dcb383203d24e1a2e95501a1e498a47';
    const token = '4707d6cca8c5acc66161557eec22b5fdf4d4efe63bfc88b5083f2b1e15c85b07';
    const apiUrl = 'https://api.trello.com/';

    await workbook.xlsx.readFile('excel.xlsx').then(function() {
        let worksheet = workbook.getWorksheet('Trello Sheet');

        fetch(`${apiUrl}1/boards/${organizationId}/cards?key=${key}&token=${token}`)
        .then(res => res.json())
        .then(json => {
            for (let i = 0; i < json.length; i++) {
                console.log(json[i].id);
            }
        });

        let row = worksheet.lastRow;
        let getLastRowValue = row?.values;
        console.log(getLastRowValue);

        // worksheet.columns = [
        //     {header: 'Id', key: 'id', width: 10},
        //     {header: 'Name', key: 'name', width: 32},
        //     {header: 'D.O.B.', key: 'dob', width: 15},
        // ];

        // let i = 1;
        // setInterval(function() {
        //     worksheet.addRow({id: i++, name: 'New Guy ' + i++, dob: new Date(2000, 1, 1)});
        //     workbook.xlsx.writeFile('excel.xlsx');
        // }, 3000);
    });
};