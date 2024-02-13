import { TChildren } from '@interfaces';
import { STORE_IDS, TStores } from '@stores';
import { TLocalizationData } from '@stores-types/localeStore';

export type TLocaleProviderProps = TChildren;

export type TLocaleProviderPropsStore = TLocaleProviderProps &
  Pick<TStores, STORE_IDS.LOCALE_STORE>;

export type TLocaleProviderContext = Record<'locale', string> &
  Record<'localizationData', TLocalizationData>;
