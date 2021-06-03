export const sheetAppendFile = (fileId: string, array: any) => ({
  spreadsheetId: fileId,
  valueInputOption: "RAW",
  range: "A2",
  requestBody: {
    values: array,
  },
});
