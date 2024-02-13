import React, { ReactElement, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import classNames from 'classnames';

//import 'react-datepicker/dist/react-datepicker.css';
import style from './DatepickerWidget.module.scss';

import cfg from '@root/config.json';
import { WithTracking } from '@components/hocs';
import { LandmarkRoles } from '@src/roles';
import { EFormEvents } from '@src/trackingConstants';
import { ReactInputMaskWidget } from '../ReactInputMaskWidget';
import { TReactDatePickerProps } from './@types';

export const DatepickerWidget = (
  props: TReactDatePickerProps
): ReactElement => {
  const {
    className,
    customInput: customInputComponent,
    invalid,
    inputType,
    inputMask,
    peekNextMonth = true,
    showMonthDropdown = true,
    showYearDropdown = true,
    dropdownMode = 'select',
    ...datepickerWidgetProps
  } = props;

  const customInput = useMemo(() => {
    return (
      customInputComponent ?? (
        <ReactInputMaskWidget
          {...{
            invalid,
            type: inputType,
            mask: inputMask,
            maskChar: cfg.maskChar,
          }}
        />
      )
    );
  }, [customInputComponent, inputMask, inputType, invalid]);

  const datePickerProps = {
    customInput,
    peekNextMonth,
    showMonthDropdown,
    showYearDropdown,
    dropdownMode,
    ...datepickerWidgetProps,
  };

  return (
    <WithTracking
      id={`DatepickerWidget-${LandmarkRoles.form}`}
      events={[
        EFormEvents.CHANGE,
        // EWidgetEvent.CALENDAR_OPEN,
        // EWidgetEvent.INPUT_CLICK,
        // EFormEvents.SELECT,
      ]}
    >
      <DatePicker
        className={classNames(style.select, className)}
        {...datePickerProps}
      />
    </WithTracking>
  );
};
