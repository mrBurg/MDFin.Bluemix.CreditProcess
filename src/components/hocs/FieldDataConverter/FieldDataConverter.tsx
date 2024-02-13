import React from 'react';
import moment from 'moment';
import each from 'lodash/each';

import { divideDigits, gt } from '@utils';
import { TFieldDataConverterProps } from './@types';
import cfg from '@root/config.json';
import { FIELD_TYPE } from '@src/constants';

function renderFieldDataConverter(props: TFieldDataConverterProps) {
  const { type, children } = props;

  let currentType = '';

  each(cfg.fieldTypes, (item, key) => {
    if ((item as string[]).includes(type)) {
      currentType = key;

      return false;
    }
  });

  switch (currentType) {
    case FIELD_TYPE.CURRENCY:
      return `${divideDigits(Number(children))} ${gt.gettext(currentType)}`;
    case FIELD_TYPE.DAY:
      return `${children} ${gt.ngettext(
        currentType,
        FIELD_TYPE.DAY,
        Number(children)
      )}`;
    case FIELD_TYPE.TERM_FRACTION_D:
      return `${children} ${gt.ngettext('Day', 'Days', Number(children))}`;
    case FIELD_TYPE.TERM_FRACTION_M:
      return `${children} ${gt.ngettext('Month', 'Months', Number(children))}`;
    case FIELD_TYPE.DATE:
      return `${moment(children).format(cfg.dateFormat.toUpperCase())}`;
    case FIELD_TYPE.SHORT_DATE:
      return `${moment(children).format(cfg.tinyDateFormat)}`;
    default:
      return children;
  }
}

function FieldDataConverter(props: TFieldDataConverterProps) {
  return <>{renderFieldDataConverter(props)}</>;
}

export { FieldDataConverter };
