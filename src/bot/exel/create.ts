import { google } from "googleapis";

export async function createFile(fileName: string) {
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

  const list = await driveAuth.files.list({
    q: "name='" + fileName + "'",
  });
  const filesList = list.data.files?.[0];

  let createdFileData = {};

  if (filesList === undefined) {
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
    return filesList;
  }

  return createdFileData;
}
