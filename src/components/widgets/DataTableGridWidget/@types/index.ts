import { ReactElement } from 'react';

export type TItemData = {
  label?: string;
  value?: string | ReactElement;
};

export type TDataTableGridItem = {
  title: string;
  itemData: TItemData[];
};

export type TDataTableGridProps = {
  data?: TDataTableGridItem[];
};
