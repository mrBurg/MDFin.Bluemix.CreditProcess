import { TChildren } from '@interfaces';
import { STORE_IDS, TStores } from '@stores';
import { TAppProps } from '@stores-types/userStore';

export type TAppProviderProps = TChildren;

export type TAppProviderPropsStore = TAppProviderProps &
  Pick<TStores, STORE_IDS.USER_STORE | STORE_IDS.TRACKING_STORE>;

export type TAppProviderContext = TAppProps;
