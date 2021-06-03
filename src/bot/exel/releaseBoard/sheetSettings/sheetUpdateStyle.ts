export const updateSheetStyle = (fileId: string) => ({
  spreadsheetId: fileId,
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
});
