export const sheetAddHeaders = (fileId: string) => ({
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
});
