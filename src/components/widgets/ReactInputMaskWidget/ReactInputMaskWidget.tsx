import React, { forwardRef, Ref } from 'react';
import InputMask from 'react-input-mask';

import { TReactInputMaskWidgetProps } from './@types';
import { InputWidget } from '../InputWidget';

const ReactInputMaskWidgetComponent = (
  props: TReactInputMaskWidgetProps,
  ref: Ref<HTMLInputElement>
) => {
  const { maskChar, ...restProps } = props;
  const componentProps = {
    maskChar,
    ...restProps,
  };

  return (
    <InputMask {...componentProps}>
      {(() => <InputWidget ref={ref} {...restProps} />) as any}
    </InputMask>
  );
};

export const ReactInputMaskWidget = forwardRef(ReactInputMaskWidgetComponent);
