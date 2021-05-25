import { google } from "googleapis";

type Action = {
  data: {
    card: {
      desc: string;
      name: string;
      shortLink: string;
    };
    board: {
      id: string;
      name: string;
      shortLink: string;
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
  memberCreator: {
    username: string;
  };
};

type FileData = {
  id: string;
  name: string;
};

export async function readFile(fileData: FileData, cardData: Action) {
  const fileId = fileData.id;
  const boardName = cardData.data.board.name;
  const cardName = cardData.data.card.name;
  const shortlinkCard = "https://trello.com/c/" + cardData.data.card.shortLink;
  const shortLinkBoard =
    "https://trello.com/b/" + cardData.data.board.shortLink;
  const memberCreator = cardData.memberCreator.username;
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
          "Ссылка на доску",
          "Название карточки",
          "Имя ответственного",
          "Ссылка на карточку",
          "Предыдущий список",
          "Текущий список",
          "Количество записей",
        ],
      ],
      majorDimension: "ROWS",
    },
  };

  const sheetAppendValues = {
    spreadsheetId: fileId,
    valueInputOption: "RAW",
    range: "A2",
    requestBody: {
      values: [
        [
          boardName,
          shortLinkBoard,
          cardName,
          memberCreator,
          shortlinkCard,
          listBefore,
          listAfter,
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

  const getNumberOfValues = await sheetsAuth.spreadsheets.values.get({
    range: "A2:A",
    spreadsheetId: fileId,
  });

  const valuesCountFormula =
    "=COUNTA(A2:A" +
    ((getNumberOfValues.data.values?.length
      ? getNumberOfValues.data.values?.length
      : 1) + 1) +
    ")";

  const sheetAppendValuesCount = {
    spreadsheetId: fileId,
    valueInputOption: "USER_ENTERED",
    range: "H2",
    requestBody: {
      values: [[valuesCountFormula]],
    },
    responseValueRenderOption: "FORMULA",
  };

  await sheetsAuth.spreadsheets.values.update(sheetAppendValuesCount);
}
