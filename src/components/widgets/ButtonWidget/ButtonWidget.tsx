import React, { forwardRef, Ref, useMemo } from 'react';
import classNames from 'classnames';

import style from './ButtonWidget.module.scss';

import { WithTracking } from '@components/hocs';
import { AbstractRoles, WidgetRoles } from '@src/roles';
import { EMouseEvents } from '@src/trackingConstants';
import { TButtonWidgetProps } from './@types';

export enum BUTTON_LAYOUT {
  BUTTON = 'button',
  INLINE = 'inline',
}

export enum BUTTON_TYPE {
  BUTTON = 'button',
  SUBMIT = 'submit',
}

function ButtonWidgetComponent(
  props: TButtonWidgetProps,
  ref: Ref<HTMLButtonElement>
) {
  const {
    id = `ButtonWidget-${AbstractRoles.input}`,
    buttonLayout = BUTTON_LAYOUT.BUTTON,
    className,
    ...restProps
  } = props;

  const button = useMemo(() => {
    switch (buttonLayout) {
      case BUTTON_LAYOUT.BUTTON:
        return (
          <button
            id={id}
            className={classNames(
              'button-widget',
              style.buttonWidget,
              className
            )}
            role={WidgetRoles.button}
            ref={ref}
            {...restProps}
          />
        );
      case BUTTON_LAYOUT.INLINE:
        return (
          <span
            id={id}
            className={classNames('button-widget', className)}
            role={WidgetRoles.button}
            {...restProps}
          />
        );
    }
  }, [buttonLayout, className, id, ref, restProps]);

  return (
    <WithTracking id={id} events={[EMouseEvents.CLICK]}>
      {button}
    </WithTracking>
  );
}

export const ButtonWidget = forwardRef(ButtonWidgetComponent);
