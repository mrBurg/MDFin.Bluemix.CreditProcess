export enum SOCIAL_NETWORK {
  FACEBOOK = 'facebook',
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  X = 'x',
}

export type TShareType = {
  [key in SOCIAL_NETWORK]: string;
};

export type TContentItem = {
  text: string;
  subTitle?: string;
};

export type TSectionItem = {
  content: TContentItem[];
  title?: string;
};

export type TSection = TSectionItem[];

export type TPromoPageContent = {
  pageTitle: string;
  imagePath: string;
  sections: TSection;
};
