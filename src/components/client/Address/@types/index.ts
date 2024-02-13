import { PageStore } from '@src/stores/PageStore';
import { UserStore } from '@src/stores/UserStore';

export type TAddress = {
  staticData: any;
  pageStore: PageStore;
  userStore: UserStore;
};

export type TState = {
  isRender: boolean;
  invalidFields: string[];
};

export type TFieldData = Record<'name' | 'value', string>;
