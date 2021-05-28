export type CardsType = {
  id: string;
  cardId: string;
  cardName: string;
  dateCreate: string;
  dateUpdate: string;
  shortLink: string;
};

export type CardsCreate = {
  cardName: string;
  cardId: string;
  dateCreate: string;
  dateUpdate: string;
  shortLink: string;
};