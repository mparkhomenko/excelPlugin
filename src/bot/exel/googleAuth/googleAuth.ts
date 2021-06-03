import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "./src/bot/exel/googleAuth/leenda-creds.json",
  scopes: [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/spreadsheets",
  ],
});

export const sheetsAuth = google.sheets({
  version: "v4",
  auth: auth,
});

export const driveAuth = google.drive({
  version: "v3",
  auth: auth,
});
