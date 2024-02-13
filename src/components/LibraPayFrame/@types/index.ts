import { PageStore } from '@src/stores/PageStore';

export type TLibraPayFrame = Record<'url' | 'body', string> &
  Record<'pageStore', PageStore>;
