export type CardsType = {
  id: string;
  cardId: string;
  listId: string;
  cardName: string;
  dateCreate: string;
  dateUpdate: string;
  shortLink: string;
};

export type CardsCreate = {
  cardName: string;
  cardId: string;
  listId: string;
  dateCreate: string;
  dateUpdate: string;
  shortLink: string;
};