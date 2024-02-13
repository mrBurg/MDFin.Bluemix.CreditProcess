import { UserStore } from '@src/stores/UserStore';

export type TMobileMenuProps = unknown;

export type TMobileMenuPropsStore = {
  userStore: UserStore;
} & TMobileMenuProps;
