import { google } from 'googleapis';

export async function createFile(fileName:string) {
    const auth = new google.auth.GoogleAuth({
        keyFile: './src/bot/exel/leenda-d0add9b33944.json',
        scopes: [
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/spreadsheets',
        ],
    });

    const drive = google.drive({
        version: 'v3',
        auth: auth
    });

    const list = await drive.files.list({
        q: "name='" + fileName + "'",
    });
    const filesList = list.data.files;

    let createdFileData = {};
    if (filesList === undefined || filesList.length == 0) {
        const createdFile = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType: 'application/vnd.google-apps.spreadsheet',
                parents: ['10Z2CvyQNPPkjpd6o1E0MrEFEimXAWOy6'],
            },
        });

        createdFileData = createdFile.data;
    } else {
        return filesList;
    }

    return createdFileData;
};