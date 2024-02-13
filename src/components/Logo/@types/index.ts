import { UserStore } from '@src/stores/UserStore';

export type TLogoProps = {
  className?: string;
};

export type TLogoPropsStore = {
  userStore: UserStore;
} & TLogoProps;
