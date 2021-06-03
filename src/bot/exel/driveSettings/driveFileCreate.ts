export const fileCreate = (fileName: string) => ({
  requestBody: {
    name: fileName,
    mimeType: "application/vnd.google-apps.spreadsheet",
    parents: ["10Z2CvyQNPPkjpd6o1E0MrEFEimXAWOy6"],
  },
});
