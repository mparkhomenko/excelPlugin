import { google } from "googleapis";
import { KEY, TOKEN } from "./constants";
import fetch from "node-fetch";
import { uploadReleaseData } from "./releaseUpload";

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
      getFiles(json);
    })
    .catch((err) => console.error(err));

  const getFiles = async (element: any) => {
    for (let i = 0; i < element.length; i++) {
      let listId = element[i].id;
      let listName = element[i].name;
      let filesList = await driveAuth.files.list({
        q: "name='" + element[i].name + "'",
      });

      let result = filesList.data.files?.[0];
      let fileName = element.name;

      await createdFileData(result, fileName);

      uploadReleaseData(listId, listName);
    }
  };

  let createdFileData = async (result: any, fileName: string) => {
    if (result === undefined) {
      const fileCreate = {
        requestBody: {
          name: fileName,
          mimeType: "application/vnd.google-apps.spreadsheet",
          parents: ["10Z2CvyQNPPkjpd6o1E0MrEFEimXAWOy6"],
        },
      };
      await driveAuth.files.create(fileCreate);
    }
  };
}
