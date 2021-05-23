import * as Excel from 'exceljs';
const { GoogleSpreadsheet } = require('google-spreadsheet');

type Action = {
    data: {
        card: {
            desc:string,
            name:string,
            shortLink:string
        },
        board: {
            id:string,
            name:string,
            shortLink:string
        },
        list?: {
            name: string,
        },
        listBefore?: { 
            name:string 
        },
        listAfter?: { 
            name:string
        },
    },
    memberCreator: {
        username:string,
    }
}

export async function readFile(fileName:string, cardData:Action) {
    const workbook = new Excel.Workbook();
    const boardName = cardData.data.board.name;
    const cardName = cardData.data.card.name;
    const shortlinkCard = 'https://trello.com/c/' + cardData.data.card.shortLink;
    const shortLinkBoard = 'https://trello.com/b/' + cardData.data.board.shortLink;
    const memberCreator = cardData.memberCreator.username;
    const listCreated = cardData.data.list?.name || "";
    const listBefore = cardData.data.listBefore?.name;
    const listAfter = cardData.data.listAfter?.name;

    await workbook.xlsx.readFile(fileName + '.xlsx')
     
    let worksheet = workbook.getWorksheet('Sheet');

    worksheet.columns = [
        {header: 'Доска', key: 'BoardName', width: 32},
        {header: 'Ссылка на доску', key: 'ShortLinkBoard', width: 32},
        {header: 'Название карточки', key: 'CardName', width: 32},
        {header: 'Имя создателя', key: 'CardCreator', width: 32},
        {header: 'Ссылка на карточку', key: 'ShortLinkCard', width: 32},
        {header: 'Список создания карточки', key: 'ListCreated', width: 32},
        {header: 'Предыдущий список', key: 'ListBefore', width: 32},
        {header: 'Текущий список', key: 'ListAfter', width: 32},
    ];

    worksheet.addRow(
        {
            BoardName: boardName, 
            ShortLinkBoard: shortLinkBoard, 
            CardName: cardName,
            CardCreator: memberCreator,
            ShortLinkCard: shortlinkCard,
            ListCreated: listCreated,
            ListBefore: listBefore,
            ListAfter: listAfter
        }
    );
    workbook.xlsx.writeFile(fileName + '.xlsx');
};