import { CLIENT_TABS } from '@src/constants';

export type TTab = {
  index: number;
  label: string;
};

export type TTabs = Record<CLIENT_TABS, TTab>;

export type TClientTabsProps = {
  current: CLIENT_TABS;
  className?: string;
};
