import { google } from "googleapis";
const ACTION_MOVE_CARD_FROM_LIST_TO_LIST = "action_move_card_from_list_to_list";
const ACTION_CREATE_CARD = "action_create_card";

type Action = {
  data: {
    card: {
      id: string;
      desc: string;
      name: string;
      shortLink: string;
    };
    board: {
      id: string;
      name: string;
    };
    list?: {
      name: string;
    };
    listBefore?: {
      name: string;
    };
    listAfter?: {
      name: string;
    };
  };
  date: string;
  memberCreator: {
    username: string;
  };
};

type FileData = {
  id: string;
  name: string;
};

type CardData = {
  date: string;
};

type ActionType = {
  translationKey: string;
};

export async function readFile(
  fileData: FileData,
  cardData: Action,
  actionType: ActionType,
  cardDateCreate: CardData
) {
  const action = actionType.translationKey;
  if (
    action != ACTION_MOVE_CARD_FROM_LIST_TO_LIST &&
    action != ACTION_CREATE_CARD
  ) {
    return;
  }

  const cardId = cardData.data.card.id;
  const fileId = fileData.id;
  const boardName = cardData.data.board.name;
  const cardName = cardData.data.card.name;
  const shortlinkCard = "https://trello.com/c/" + cardData.data.card.shortLink;
  const dateUpdate = new Date(cardData.date).toISOString().split("T")[0];
  const dateCreate = new Date(1000 * parseInt(cardId.substring(0, 8), 16))
    .toISOString()
    .split("T")[0];
  const memberCreator = cardData.memberCreator.username;
  const listCreated = cardData.data.list?.name;
  const listBefore = cardData.data.listBefore?.name;
  const listAfter = cardData.data.listAfter?.name;

  const auth = new google.auth.GoogleAuth({
    keyFile: "./src/bot/exel/leenda-creds.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheetsAuth = google.sheets({
    version: "v4",
    auth: auth,
  });

  const getSheetData = {
    spreadsheetId: fileId,
    ranges: ["A1"],
  };

  const sheetAddHeaders = {
    spreadsheetId: fileId,
    valueInputOption: "USER_ENTERED",
    range: "A1",
    requestBody: {
      values: [
        [
          "Доска",
          "Дата создания",
          "Дата изменения",
          "Название карточки",
          "Имя ответственного",
          "Ссылка на карточку",
          "Предыдущий список",
          "Текущий список",
        ],
      ],
      majorDimension: "ROWS",
    },
  };

  const list = listAfter ? listAfter : listCreated;
  const sheetAppendValues = {
    spreadsheetId: fileId,
    valueInputOption: "RAW",
    range: "A2",
    requestBody: {
      values: [
        [
          boardName,
          dateCreate,
          dateUpdate,
          cardName,
          memberCreator,
          shortlinkCard,
          listBefore,
          list,
        ],
      ],
    },
  };

  const getSheet = await sheetsAuth.spreadsheets.get(getSheetData);
  const sheetId = getSheet.data.sheets?.[0].properties?.sheetId;

  const updateSheetStyle = {
    spreadsheetId: fileId,
    requestBody: {
      requests: [
        {
          repeatCell: {
            range: {
              sheetId: sheetId,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: 8,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: {
                  red: 0.85,
                  green: 0.85,
                  blue: 1.0,
                },
                horizontalAlignment: "CENTER",
                textFormat: {
                  foregroundColor: {
                    red: 0.0,
                    green: 0.0,
                    blue: 0.0,
                  },
                  fontSize: 12,
                  bold: true,
                },
              },
            },
            fields:
              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
          },
        },
        {
          updateDimensionProperties: {
            range: {
              sheetId: sheetId,
              dimension: "COLUMNS",
              startIndex: 0,
              endIndex: 8,
            },
            properties: {
              pixelSize: 220,
            },
            fields: "pixelSize",
          },
        },
      ],
    },
  };

  await sheetsAuth.spreadsheets.values.update(sheetAddHeaders);

  await sheetsAuth.spreadsheets.values.append(sheetAppendValues);

  await sheetsAuth.spreadsheets.batchUpdate(updateSheetStyle);
}
