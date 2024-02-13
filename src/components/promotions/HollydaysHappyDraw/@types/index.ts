import { TJSON } from '@interfaces';
import { LoanStore } from '@src/stores/LoanStore';

export type THollydaysHappyDraw = TJSON;

export type THollydaysHappyDrawStore = THollydaysHappyDraw & {
  loanStore: LoanStore;
};

export type TListItem = {
  imageUrl: string;
  description: string;
};
