import { ReactElement } from 'react';

export type TShowBlockToDate = {
  children: ReactElement | ReactElement[];
  expiryDate: number | string;
};
