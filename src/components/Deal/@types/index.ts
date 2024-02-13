import { TJSON } from '@interfaces';
import { PageStore } from '@src/stores/PageStore';
import { TStores } from '@stores';
import { TCabinetDeals } from '@stores-types/loanStore';
import { Dispatch, SetStateAction } from 'react';

export type TViewProps = Record<'staticData', TJSON> &
  Record<'model', TCabinetDeals & Record<'dataIsInvalid', boolean>> &
  Record<
    'controller',
    Record<'cabinetPay', () => void> &
      Record<'callback', Dispatch<SetStateAction<boolean>>>
  >;

export type TViewPropsStore = Record<'pageStore', PageStore> & TViewProps;

export type TDeal = TStores;
