import { ChangeEvent, MouseEvent, FocusEvent, FormEvent } from 'react';

export type TJSON = Record<string | number, any>;

export type TChangeEvent = ChangeEvent<HTMLInputElement>;
export type TClickEvent = MouseEvent<HTMLElement>;
export type TFocusEvent = FocusEvent<HTMLInputElement>;
export type TSubmitEvent = FormEvent<HTMLFormElement | HTMLInputElement>;
export type TGaType = Record<'trackingId', string> &
  Partial<Record<'deactivated', boolean>>;
export type TChildren = Record<
  'children',
  any
  // TODO
  /* ReactElement | ReactElement[] | null | undefined | JSX.Element | Element */
>;

export type TError = Record<'message', string>;
