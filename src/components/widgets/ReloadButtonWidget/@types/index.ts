import { UserStore } from '@src/stores/UserStore';

export type TReloadButtonWidget = {
  reloadHandler: (callBack?: () => void) => Promise<void>;
  className?: string;
};

export type TReloadButtonWidgetStore = {
  userStore: UserStore;
} & TReloadButtonWidget;
