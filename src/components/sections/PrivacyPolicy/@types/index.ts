export type TItemContent = Partial<Record<'p' | 'numList', string[]>>;

export type TPageContentItem = Record<'title', string> &
  Record<'content', TItemContent>;

export type TPageContent = TPageContentItem[];

export type TPrivacyPolicy = Record<'pageTitle' | 'footer', string> &
  Record<'pageContent', TPageContent>;
