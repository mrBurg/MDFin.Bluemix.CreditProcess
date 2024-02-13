import { TStores } from '@stores';
import { Dispatch, SetStateAction } from 'react';

export type TMainPageProps = TStores;

export type TMainPageContext = {
  setProductSelector: Dispatch<SetStateAction<boolean>>;
  hasProductSelector: boolean;
};
