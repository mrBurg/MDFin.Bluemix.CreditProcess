import { TCheckboxData } from '@components/widgets/CheckboxWidget/@types';
import { TDocumentUnit } from '@stores-types/loanStore';
import { FormEvent } from 'react';

export type TPolicyDataKey =
  | 'agreeLoan'
  | 'agreeDeclaration'
  | 'marketingConfirmation'
  | 'agreeFeis';

export type TPolicyData = Record<
  TPolicyDataKey,
  Record<'checked', boolean> &
    Record<'text', string> &
    Partial<Record<'invalid' | 'accent', boolean>>
>;

export type TPolicyInfoProps = {
  checkBoxes: TPolicyData;
  onChange: (data: TCheckboxData, event: FormEvent<HTMLInputElement>) => void;
  docs?: TDocumentUnit[];
  className?: string;
};
