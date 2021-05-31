export type CardsType = {
  id: string;
  cardId: string;
  listName: string;
  cardName: string;
  dateCreate: string;
  dateUpdate: string;
  shortLink: string;
  isSended: boolean;
};

export type CardsCreate = {
  cardName: string;
  cardId: string;
  listName: string;
  dateCreate: string;
  dateUpdate: string;
  shortLink: string;
  isSended: boolean;
};