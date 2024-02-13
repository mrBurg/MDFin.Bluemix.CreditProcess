import { UserStore } from '@src/stores/UserStore';

export type TActionButtons = unknown;

export type TActionButtonsStore = {
  userStore: UserStore;
} & TActionButtons;
