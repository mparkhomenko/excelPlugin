export type CardsType = {
  id: string;
  cardId: string;
  listName: string;
  cardName: string;
  dateCreate: string;
  dateUpdate: string;
  shortlinkCard: string;
  isSended: boolean;
};

export type CardsCreate = {
  cardName: string;
  cardId: string;
  listName: string;
  dateCreate: string;
  dateUpdate: string;
  shortlinkCard: string;
  isSended: boolean;
};