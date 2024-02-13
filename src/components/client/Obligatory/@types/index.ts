import { TJSON, TSubmitEvent } from '@interfaces';
import { PageStore } from '@src/stores/PageStore';
import { UserStore } from '@src/stores/UserStore';
import { TMainFieldsProps } from '../MainFields/@types';
import { TAdditionalFieldsProps } from '../AdditionalFields/@types';
import { TPolicyProps } from '../Policy/@types';
import { LoyaltyStore } from '@src/stores/LoyaltyStore';
import { LoanStore } from '@src/stores/LoanStore';
import { ReactElement } from 'react';

export type TObligatory = Record<'userStore', UserStore> &
  Record<'pageStore', PageStore> &
  Record<'loanStore', LoanStore>;

export type TFieldData = Record<'name' | 'value', string>;

type TViewTChildren = TMainFieldsProps & TAdditionalFieldsProps & TPolicyProps;

export type TViewProps = Record<'staticData', TViewTChildren['staticData']> &
  Partial<Record<'clientTabs', ReactElement>> &
  Record<
    'model',
    Record<'userData', TViewTChildren['model']> &
      Record<'submitEnabled', boolean> &
      Partial<Record<'tags', TJSON> & Record<'personalInfoConfirmed', boolean>>
  > &
  Record<
    'controller',
    Partial<
      Record<'onSubmitHandler', (event: TSubmitEvent) => void> &
        Record<'addInfo', () => void>
    > &
      TViewTChildren['controller']
  >;

export type TViewPropsStore = Record<'loyaltyStore', LoyaltyStore> & TViewProps;
