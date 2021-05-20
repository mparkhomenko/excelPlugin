import * as Excel from 'exceljs';
import fetch from 'node-fetch';
import { DATA as CONSTANTS } from './constants';

type Board = {
    id:string
    name:string
    tasks:Task[]
}

type List = {
    id:string
    name:string
}

type Task = {
    id:string
    name:string
    description:string
    idBoard:string
    idList:string
    shortUrl:string
}

function isJson(str:string) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export async function readFile() {
    const workbook = new Excel.Workbook();

    await workbook.xlsx.readFile('excel.xlsx')
     
    let worksheet = workbook.getWorksheet('Trello Sheet');

    const boardsList = await fetch(`${CONSTANTS.API_URL}1/organizations/${CONSTANTS.ORGANIZATION_ID}/boards?key=${CONSTANTS.KEY}&token=${CONSTANTS.TOKEN}`)
    const boardsText = await boardsList.text()

    if(!isJson(boardsText)) return [];

    const boardsJson = JSON.parse(boardsText);

    const boards = boardsJson.map((raw:any) => {
        const board:Board = {
            id:raw.id,
            name:raw.name,
            tasks:[]
        }
        return board
    }) as Board[]

    const boardsResult = boards.find(res => res.name == '1. Все баги (QA)');

    if(!boardsResult) return null

    const tasksList = await fetch(`${CONSTANTS.API_URL}1/boards/${boardsResult?.id}/cards?key=${CONSTANTS.KEY}&token=${CONSTANTS.TOKEN}`)
    const tasksText = await tasksList.text()

    if(!isJson(tasksText)) return [];

    const tasksJson = JSON.parse(tasksText);
    
    
    boardsResult.tasks = tasksJson.map((raw:any) => {
        const task:Task = {
            id:raw.id,
            name:raw.name,
            description:raw.desc,
            idBoard:raw.idBoard,
            idList:raw.idList,
            shortUrl:raw.shortUrl
        }
        return task
    }) as Task[]
    
    return boardsResult
    // let row = worksheet.lastRow;
    // let getLastRowValue = row?.values;
    // console.log(getLastRowValue);

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
};