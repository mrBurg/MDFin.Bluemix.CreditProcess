import { TJSON } from '@interfaces';
import { StrictAccordionProps } from 'semantic-ui-react';

export enum STYLETYPE {
  GRAY = 'gray',
  TRANSPARENT = 'transparent',
}

export type TDataBlock = Record<'title' | 'text', string> &
  Partial<Record<'links' | 'tags', TJSON>>;

export type TItem = {
  itemTitle: string;
  itemData: string | TDataBlock[];
  buttonLabel: string;
};

export type TAccordionRedesignItem = {
  title?: string;
  items: TItem[];
};

export type TAccordionRedesignListItemsProps = {
  data: TAccordionRedesignItem[];
  styleType?: STYLETYPE;
} & StrictAccordionProps;
