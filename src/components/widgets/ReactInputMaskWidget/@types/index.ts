import { TInputWidgetProps } from '@components/widgets/InputWidget/@types';
import { Props } from 'react-input-mask';

export type TReactInputMaskWidgetProps = { maskChar?: string } & Props &
  TInputWidgetProps;
