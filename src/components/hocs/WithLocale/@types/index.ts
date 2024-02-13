import { LocaleStore } from '@src/stores/LocaleStore';
import { ReactNode } from 'react';

export type TWithLocaleProps = {
  children: ReactNode;
};

export type TWithLocalePropsStore = {
  localeStore: LocaleStore;
} & TWithLocaleProps;
