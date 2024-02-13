import { ReactDatePickerProps } from 'react-datepicker';

import { INPUT_TYPE } from '@components/widgets/InputWidget';

export type THandleChangeDate = {
  (date: Date): Date;
};

export type TReactDatePickerProps = {
  invalid: boolean;
  inputType: INPUT_TYPE;
  inputMask: string;
} & ReactDatePickerProps;
