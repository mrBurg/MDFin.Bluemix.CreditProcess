import React from 'react';

import { TRepaymentProps } from './@types';
import { Default } from './Default';
import { Table } from './Table';

export enum LAYOUT {
  DEFAULT = 'default',
  TABLE = 'table',
}

function Repayment(props: TRepaymentProps) {
  const { layout, ...restProps } = props;

  switch (layout) {
    case LAYOUT.TABLE:
      return <Table {...restProps} />;
    case LAYOUT.DEFAULT:
      return <Default {...restProps} />;
    default:
      console.warn('The "layout" parameter is required');

      return null;
  }
}

export { Repayment };
