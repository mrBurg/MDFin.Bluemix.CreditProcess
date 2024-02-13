import { StrictCheckboxProps, CheckboxProps } from 'semantic-ui-react';

export type TCheckboxWidgetProps = Partial<Record<'invalid', boolean>> &
  StrictCheckboxProps;

export type TCheckboxData = Record<
  'className' | 'name' | 'role' | 'type',
  string
> &
  Record<'checked' | 'indeterminate', boolean> &
  CheckboxProps;
