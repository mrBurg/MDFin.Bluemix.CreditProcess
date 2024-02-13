import moment from 'moment';
import React from 'react';

import { normalizeDate } from '@utils';
import { TShowBlockToDate } from './@types';

/**
 * @param props Дата завершения отображения в формате day/mounth/year
 * @description Возврашает элемент до указаной даты, не включая её
 * @returns children
 */
function ShowBlockToDate(props: TShowBlockToDate) {
  const currentDate = moment();
  const expiryDate = moment(normalizeDate(props.expiryDate as string));

  return currentDate < expiryDate ? <>{props.children}</> : null;
}

export { ShowBlockToDate };
