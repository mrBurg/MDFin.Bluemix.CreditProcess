import { STORE_IDS, TStores } from '@stores';

export type TLanguagesSwitcherProps = unknown;

export type TLanguagesSwitcherPropsStore = TLanguagesSwitcherProps &
  Pick<TStores, STORE_IDS.LOCALE_STORE>;
