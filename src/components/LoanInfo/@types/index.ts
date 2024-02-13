import { ReactElement } from 'react';

import { TAppDealParams, TSegments } from '@stores-types/loanStore';
import { LAYOUT } from '..';

export type TLoanInfoProps = Partial<
  Record<'title' | 'className', string> &
    Record<'layout', LAYOUT> &
    Record<'collapsed', boolean> &
    Record<'afterContent', ReactElement>
> &
  Record<'params', TAppDealParams>;

export type TDataRow = Partial<
  Record<'text' | 'link' | 'type', string> &
    Record<'value', string | number | boolean | TSegments>
>;
