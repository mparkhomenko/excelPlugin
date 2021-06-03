import { KEY, TOKEN, ID_BOARD } from "../constants";
import fetch from "node-fetch";
import { db } from "../../../db";
import { driveAuth, sheetsAuth } from "../googleAuth/googleAuth";
import { fileCreate } from "../driveSettings/driveFileCreate";
import { updateSheetStyle } from "./sheetSettings/sheetUpdateStyle";
import { sheetAddHeaders } from "./sheetSettings/sheetHeaders";
import { sheetAppendFile } from "./sheetSettings/sheetAppendFile";

const sleep = async () => new Promise((resolve) => setTimeout(resolve, 60000));

export async function uploadReleaseBoard() {
  const responseLists = await fetch(
    `https://api.trello.com/1/boards/${ID_BOARD}/lists?key=${KEY}&token=${TOKEN}`,
    {
      method: "GET",
    }
  );

  const lists = await responseLists.json();

  const cardsArray = [];
  for await (const list of lists) {
    const listId = list.id;
    const listName = list.name;
    const responseCards = await fetch(
      `https://api.trello.com/1/lists/${listId}/cards?key=${KEY}&token=${TOKEN}`,
      {
        method: "GET",
      }
    );

    const cards = await responseCards.json();
    for await (const card of cards) {
      const cardId = card.id;
      const cardName = card.name;
      const shortlinkCard = card.shortUrl;
      const dateUpdate = new Date(card.dateLastActivity)
        .toISOString()
        .split("T")[0];
      const dateCreate = new Date(1000 * parseInt(cardId.substring(0, 8), 16))
        .toISOString()
        .split("T")[0];

      await db.Card.findOrCreate({
        where: {
          cardId,
        },
        defaults: {
          listName,
          cardId,
          cardName,
          shortlinkCard,
          dateUpdate,
          dateCreate,
          isSended: false,
        },
      });
    }
  }

  await checkFiles(lists);

  const exelDataSource = await getFileIds(lists.map((list: any) => list.name));

  for await (const list of lists) {
    const cards = await db.Card.findAll({
      where: {
        listName: list.name,
        isSended: false,
      },
    });

    const objs = cards.map((card) => [
      card.cardName,
      card.dateCreate,
      card.dateUpdate,
      card.shortlinkCard,
    ]);

    const fileIdIndex = exelDataSource.findIndex(
      (source) => source.listName === list.name
    );
    const { fileId } = exelDataSource[fileIdIndex];

    await sheetsAuth.spreadsheets.values.update(sheetAddHeaders(fileId));

    await sheetsAuth.spreadsheets.values.append(sheetAppendFile(fileId, objs));

    await sheetsAuth.spreadsheets.batchUpdate(updateSheetStyle(fileId));

    await db.Card.update(
      { isSended: true },
      {
        where: {
          id: cards.map((card) => card.id),
        },
      }
    );

    await sleep();
  }
}

const getFileIds = async (listNamesArray: string[]) => {
  const arr = [];
  for await (const listName of listNamesArray) {
    const fileData = await driveAuth.files.list({
      q: `name='${listName}'`,
    });

    arr.push({
      fileId: fileData.data.files?.[0].id!,
      listName,
    });
  }

  return arr;
};

const checkFiles = async (listsData: any) => {
  for await (const element of listsData) {
    const listName = element.name;

    const filesList = await driveAuth.files.list({
      q: `name='${listName}'`,
    });

    const result = filesList.data.files?.[0];

    if (!result) {
      await driveAuth.files.create(fileCreate(listName));
    }
  }
};
