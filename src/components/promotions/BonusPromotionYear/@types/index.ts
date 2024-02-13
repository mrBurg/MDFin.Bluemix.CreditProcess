import { TJSON } from '@interfaces';
import { LoanStore } from '@src/stores/LoanStore';

export type TBlockItem = {
  title: string;
  items: string[];
};

export type TBonusPromotionYear = {
  welcome: {
    title: string;
  };
  howToGet: {
    title: string;
    subTitle: string;
    loanButton: string;
    blocks: TBlockItem[];
  };
  terms: {
    text: string;
    tags?: TJSON;
  };
};

export type TBonusPromotionYearStore = TBonusPromotionYear & {
  loanStore: LoanStore;
};
