import { ReactElement } from 'react';
import { TJSON } from '@interfaces';

export type TTagsProps = string & ReactElement & TJSON;

export type TWithTagProps = {
  children: ReactElement | ReactElement[];
  tags?: TJSON;
  wrapper?: string;
};
