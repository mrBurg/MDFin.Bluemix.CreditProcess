import { StrictAccordionProps } from 'semantic-ui-react';

export type TItem = {
  itemTitle: string;
  itemData: string;
};

export type TAccordionItem = {
  title: string;
  items: TItem[];
};

export type TAccordionListItemsProps = {
  data: TAccordionItem[];
  classNameTitle?: string;
} & StrictAccordionProps;
