import * as Excel from 'exceljs';
import fetch from 'node-fetch';
import { DATA as CONSTANTS } from './constants';

export async function readFile() {
    const workbook = new Excel.Workbook();

    await workbook.xlsx.readFile('excel.xlsx').then(function() {
        let worksheet = workbook.getWorksheet('Trello Sheet');

        fetch(`${CONSTANTS.API_URL}1/boards/${CONSTANTS.ORGANIZATION_ID}/cards?key=${CONSTANTS.KEY}&token=${CONSTANTS.TOKEN}`)
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