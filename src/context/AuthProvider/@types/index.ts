import { AUTH_PROVIDER } from '@context/contextConstants';
import { TChildren } from '@interfaces';
import { UserStore } from '@src/stores/UserStore';
import { STORE_IDS, TStores } from '@stores';

export type TAuthProviderProps = TChildren;

export type TAuthProviderPropsStore = TAuthProviderProps &
  Pick<TStores, STORE_IDS.USER_STORE>;

export type TAuthProviderHelperPropsStore = TAuthProviderProps &
  TAuthProviderPropsStore;

export type TAuthProviderContext = Record<'authState', AUTH_PROVIDER> &
  Pick<UserStore, 'userLoggedIn' | 'isCabinet'> &
  Record<'userData', Pick<UserStore, 'userFirstName' & 'userLastName'>>;
