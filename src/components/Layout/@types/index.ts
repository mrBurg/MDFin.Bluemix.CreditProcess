import { Dispatch, SetStateAction } from 'react';
import { TStores } from '@stores';
import { NextComponentType } from 'next';
import { TJSON } from '@interfaces';

export type TLayoutProps = Record<'Component', NextComponentType> &
  TStores &
  Partial<Record<'template', TJSON>>;

export type TLayoutContext = Record<
  'setBlur',
  Dispatch<SetStateAction<boolean>>
> &
  Record<'blur', boolean>;
