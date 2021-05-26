import { google } from "googleapis";
import { KEY, TOKEN } from "./constants";
import fetch from "node-fetch";
import { uploadReleaseData } from "./releaseUpload";

type List = {
  id: string;
  name: string;
};

export async function boardRelease() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "./src/bot/exel/leenda-creds.json",
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/spreadsheets",
    ],
  });

  const driveAuth = google.drive({
    version: "v3",
    auth: auth,
  });
  const boardId = "5fcf8614c49b5b708d791a4b";

  fetch(
    `https://api.trello.com/1/boards/${boardId}/lists?key=${KEY}&token=${TOKEN}`,
    {
      method: "GET",
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      list(json);
    })
    .catch((err) => console.error(err));

  const getFiles = async (element: List) => {
    let listId = element.id;
    let filesList = await driveAuth.files.list({
      q: "name='" + element.name + "'",
    });

    let result = filesList.data.files?.[0];
    let fileName = element.name;

    let fileData = await createdFileData(result, fileName);

    uploadReleaseData(fileData, listId);
  };

  const list = (data: any) => {
    data.forEach((element: List) => {
      getFiles(element);
    });
  };

  let createdFileData = async (result: any, fileName: string) => {
    let createdFileData = {};

    if (result === undefined) {
      const fileCreate = {
        requestBody: {
          name: fileName,
          mimeType: "application/vnd.google-apps.spreadsheet",
          parents: ["10Z2CvyQNPPkjpd6o1E0MrEFEimXAWOy6"],
        },
      };
      const createdFile = await driveAuth.files.create(fileCreate);

      createdFileData = createdFile.data;
    } else {
      return result;
    }

    return createdFileData;
  };
}
