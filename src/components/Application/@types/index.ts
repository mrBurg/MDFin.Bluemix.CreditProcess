import { Dispatch, SetStateAction } from 'react';

import { UserStore } from '@src/stores/UserStore';
import { LoanStore } from '@src/stores/LoanStore';

import { TJSON } from '@interfaces';
import { TEmail, TLoanRequest, TPaymentToken } from '@stores-types/loanStore';
import { PageStore } from '@src/stores/PageStore';
import { TPolicyData, TPolicyDataKey } from '@components/PolicyInfo/@types';
import { TCheckboxData } from '@components/widgets/CheckboxWidget/@types';

type TModel = Record<'checkBoxes', TPolicyData> &
  Record<'invalidFieldsList', string[]> &
  Record<'email', string> &
  Partial<Record<'showHolidayNotify', boolean>> &
  Record<
    | 'agreeDeclarationInfo'
    | 'showModalWindow'
    | 'isDisabled'
    | 'isSelectorRender'
    | 'upsellIsDisabled',
    boolean
  > &
  Record<'isUpsell', boolean | undefined>;

type TController = Record<'onChangeCheckbox', (data: TCheckboxData) => void> &
  Record<'updateEmail', (value: string) => void> &
  Record<
    'onBlurHandler' | 'upsellButtonHandler' | 'onFocusHandler',
    () => void
  > &
  Record<
    'setShowModalWindow' | 'setIsSelectorRender',
    Dispatch<SetStateAction<boolean>>
  > &
  Record<
    'cabinetConfirm' | 'cabinetDecline' | 'closeDeclarationInfo',
    () => Promise<void>
  >;

export type TViewProps = Record<'staticData', TJSON> &
  Record<'model', TModel> &
  Record<'controller', TController>;

export type ViewComponentStores = Record<'loanStore', LoanStore> &
  Record<'userStore', UserStore> &
  Record<'pageStore', PageStore> &
  TViewProps;

export type TPolicyDataState = Record<TPolicyDataKey, boolean>;

export type TCabinetConfirmData = Record<'paymentToken', TPaymentToken> &
  Record<'email', TEmail> &
  Partial<Record<'loanRequest', TLoanRequest>> &
  TPolicyDataState;
