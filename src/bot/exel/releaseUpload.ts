import { google } from "googleapis";
import fetch from "node-fetch";
import { KEY, TOKEN } from "./constants";
import { db } from "../../db";

type CardData = {
  id: string;
  name: string;
  dateLastActivity: string;
  shortUrl: string;
};

type ListData = {
  cardId: string;
};

export async function uploadReleaseData(listId: string, listName: string) {
  fetch(
    `https://api.trello.com/1/lists/${listId}/cards?key=${KEY}&token=${TOKEN}`,
    {
      method: "GET",
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      for (let i = 0; i < result.length; i++) {
        addCardInfoToFile(result[i], listName);
      }
    })
    .catch((err) => console.error(err));
}

const addCardInfoToFile = async (data: CardData, listName: string) => {
  const cardId = data.id;
  const cardName = data.name;
  const shortlinkCard = data.shortUrl;
  const dateUpdate = new Date(data.dateLastActivity)
    .toISOString()
    .split("T")[0];
  const dateCreate = new Date(1000 * parseInt(cardId.substring(0, 8), 16))
    .toISOString()
    .split("T")[0];

  const countOfRecords = await db.Card.findAndCountAll({
    where: {
      cardId: cardId,
    },
  });

  if (countOfRecords.count === 0) {
    await db.Card.create({
      cardId: cardId,
      listName: listName,
      cardName: cardName,
      dateCreate: dateCreate,
      dateUpdate: dateUpdate,
      shortlinkCard: shortlinkCard,
      isSended: false,
    });
  }

  const allRecords = await db.Card.findAll({
    where: {
      isSended: false,
    },
  });

  if (allRecords.length === 0) {
    return;
  }

  let elementId = "";
  for (let i = 0; i < allRecords.length; i++) {
    elementId = allRecords[i].cardId;
    await addToFile(allRecords[i]);
    await updateRecords(elementId);
  }
};

const addToFile = async (data: any) => {
  const cardName = data.cardName;
  const shortlinkCard = data.shortlinkCard;
  const dateUpdate = data.dateUpdate;
  const dateCreate = data.dateCreate;
  const listName = data.listName;

  const auth = new google.auth.GoogleAuth({
    keyFile: "./src/bot/exel/leenda-creds.json",
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/spreadsheets",
    ],
  });

  const sheetsAuth = google.sheets({
    version: "v4",
    auth: auth,
  });

  const driveAuth = google.drive({
    version: "v3",
    auth: auth,
  });

  let fileData = await driveAuth.files.list({
    q: "name='" + listName + "'",
  });

  let fileId = fileData.data.files?.[0].id;

  const sheetAddHeaders = {
    spreadsheetId: fileId?.toString(),
    valueInputOption: "USER_ENTERED",
    range: "A1",
    requestBody: {
      values: [
        [
          "Название карточки",
          "Дата создания",
          "Дата изменения",
          "Ссылка на карточку",
        ],
      ],
      majorDimension: "ROWS",
    },
  };

  const sheetAppendValues = {
    spreadsheetId: fileId?.toString(),
    valueInputOption: "RAW",
    range: "A2",
    requestBody: {
      values: [[cardName, dateCreate, dateUpdate, shortlinkCard]],
    },
  };

  const updateSheetStyle = {
    spreadsheetId: fileId?.toString(),
    requestBody: {
      requests: [
        {
          repeatCell: {
            range: {
              sheetId: 0,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: 4,
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
              sheetId: 0,
              dimension: "COLUMNS",
              startIndex: 0,
              endIndex: 4,
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
};

const updateRecords = async (cardId: string) => {
  await db.Card.update(
    { isSended: true },
    {
      where: {
        cardId: cardId,
      },
    }
  )
};
