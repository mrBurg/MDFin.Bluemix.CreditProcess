import { InputHTMLAttributes } from 'react';
import { LAYOUT } from '..';

export type TInputWidgetProps = Partial<
  Record<'label' | 'inputClassName', string> &
    Record<'invalid' | 'placeholderEmbedded', boolean> &
    Record<'tabIndex', number> &
    Record<'layout', LAYOUT>
> &
  InputHTMLAttributes<HTMLInputElement>;

export type TSelectionData = Record<'start' | 'end', number>;

export type TRef<T> = Record<'current', T>;
