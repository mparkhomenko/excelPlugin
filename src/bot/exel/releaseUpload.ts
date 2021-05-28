import { google } from "googleapis";
import fetch from "node-fetch";
import { KEY, TOKEN } from "./constants";
import { db } from "../../db";

type FileData = {
  id: string;
  name: string;
};

type CardData = {
  id: string;
  name: string;
  dateLastActivity: string;
  shortUrl: string;
};

export async function uploadReleaseData(fileData: FileData, listId: string) {
  const fileId = fileData.id;

  const auth = new google.auth.GoogleAuth({
    keyFile: "./src/bot/exel/leenda-creds.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheetsAuth = google.sheets({
    version: "v4",
    auth: auth,
  });

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
      result.forEach((element: CardData) => {
        addCardInfoToFile(element);
      });
    })
    .catch((err) => console.error(err));

  const addCardInfoToFile = async (data: CardData) => {
    const cardId = data.id;
    const cardName = data.name;
    const shortlinkCard = data.shortUrl;
    const dateUpdate = new Date(data.dateLastActivity)
      .toISOString()
      .split("T")[0];
    const dateCreate = new Date(1000 * parseInt(cardId.substring(0, 8), 16))
      .toISOString()
      .split("T")[0];

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
      spreadsheetId: fileId,
      valueInputOption: "RAW",
      range: "A2",
      requestBody: {
        values: [[cardName, dateCreate, dateUpdate, shortlinkCard]],
      },
    };

    await db.Card.create({
      cardId: cardId,
      cardName: cardName,
      dateCreate: dateCreate,
      dateUpdate: dateUpdate,
      shortlinkCard: shortlinkCard,
    })
      .then((res: any) => console.log(res))
      .catch((e: any) => console.log(e));

    // const getSheet = await sheetsAuth.spreadsheets.get(getSheetData);
    // const sheetId = getSheet.data.sheets?.[0].properties?.sheetId;

    // const updateSheetStyle = {
    //   spreadsheetId: fileId,
    //   requestBody: {
    //     requests: [
    //       {
    //         repeatCell: {
    //           range: {
    //             sheetId: sheetId,
    //             startRowIndex: 0,
    //             endRowIndex: 1,
    //             startColumnIndex: 0,
    //             endColumnIndex: 4,
    //           },
    //           cell: {
    //             userEnteredFormat: {
    //               backgroundColor: {
    //                 red: 0.85,
    //                 green: 0.85,
    //                 blue: 1.0,
    //               },
    //               horizontalAlignment: "CENTER",
    //               textFormat: {
    //                 foregroundColor: {
    //                   red: 0.0,
    //                   green: 0.0,
    //                   blue: 0.0,
    //                 },
    //                 fontSize: 12,
    //                 bold: true,
    //               },
    //             },
    //           },
    //           fields:
    //             "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
    //         },
    //       },
    //       {
    //         updateDimensionProperties: {
    //           range: {
    //             sheetId: sheetId,
    //             dimension: "COLUMNS",
    //             startIndex: 0,
    //             endIndex: 4,
    //           },
    //           properties: {
    //             pixelSize: 220,
    //           },
    //           fields: "pixelSize",
    //         },
    //       },
    //     ],
    //   },
    // };

    // await sheetsAuth.spreadsheets.values.update(sheetAddHeaders);

    // await sheetsAuth.spreadsheets.values.append(sheetAppendValues);

    // await sheetsAuth.spreadsheets.batchUpdate(updateSheetStyle);
  };
}
