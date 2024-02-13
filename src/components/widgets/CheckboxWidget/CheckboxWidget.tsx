import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import classNames from 'classnames';

import style from './CheckboxWidget.module.scss';
import { WithTracking } from '@components/hocs';
import { WidgetRoles } from '@src/roles';
import { EFormEvents } from '@src/trackingConstants';
import { TCheckboxWidgetProps } from './@types';

function CheckboxWidget(props: TCheckboxWidgetProps) {
  const { className, label, name, invalid, ...checkboxPorps } = props;

  return (
    <WithTracking
      id={`CheckboxWidget-${WidgetRoles.checkbox}`}
      events={[EFormEvents.CHANGE]}
    >
      <Checkbox
        className={classNames(className, style.checkbox, {
          [style.error]: invalid,
        })}
        label={label}
        name={name}
        role={WidgetRoles.checkbox}
        {...checkboxPorps}
      />
    </WithTracking>
  );
}

export { CheckboxWidget };
