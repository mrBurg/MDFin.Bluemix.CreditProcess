import { ButtonHTMLAttributes } from 'react';
import { BUTTON_LAYOUT } from '..';

export type TButtonWidgetProps = {
  buttonLayout?: BUTTON_LAYOUT;
} & ButtonHTMLAttributes<HTMLButtonElement>;
