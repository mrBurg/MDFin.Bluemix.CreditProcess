import { STORE_IDS, TStores } from '@stores';

export type TDeveloperMenuProps = any; // Record<string, never>;

export type TDeveloperMenuPropsStore = Pick<TStores, STORE_IDS.USER_STORE>;
