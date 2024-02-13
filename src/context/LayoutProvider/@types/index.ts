import { TChildren, TJSON } from '@interfaces';
import { Dispatch, SetStateAction } from 'react';

export type TLayoutProviderProps = TChildren &
  Partial<Record<'template', TJSON>>;

export type TLayoutProviderPropsStore = TLayoutProviderProps;

export type TLayoutProps = Partial<
  Record<
    | 'hasBackground'
    | 'hasHeader'
    | 'headerLess'
    | 'footerType'
    | 'showLoanButton'
    | 'showReminder'
    | 'showPromo',
    boolean
  > &
    Record<'reminderTimeout', number> &
    Record<'reminderTemplate', string>
>;

export type TLayoutProviderContext = TLayoutProps &
  Record<
    'setBlur' | 'setLoading' | 'setProductSelector',
    Dispatch<SetStateAction<boolean>>
  > &
  Record<'hasBlur' | 'loading' | 'hasProductSelector', boolean>;
