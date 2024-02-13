import React, {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  // useState,
} from 'react';
import classNames from 'classnames';

import style from './InputWidget.module.scss';

import { WithTracking } from '@components/hocs';
import { AbstractRoles } from '@src/roles';
import {
  EFocusEvents,
  EKeyboardEvents,
  EMouseEvents,
} from '@src/trackingConstants';
import { TInputWidgetProps, TRef /* TSelectionData */ } from './@types';
import { gt } from '@utils';
import isFunction from 'lodash/isFunction';

export enum LAYOUT {
  DEFAULT = 'default',
  SOFT = 'soft',
}

export enum INPUT_TYPE {
  TEXT = 'text',
  NUMBER = 'number',
  EMAIL = 'email',
  TEL = 'tel',
  FILE = 'file',
  CHECKBOX = 'checkbox',
  HIDDEN = 'hidden',
  CURRENCY = 'currency',
}

function InputWidgetComponent(
  props: TInputWidgetProps,
  ref: Ref<HTMLInputElement>
) {
  const {
    id = `InputWidget-${AbstractRoles.input}`,
    placeholderEmbedded = false,
    className,
    inputClassName,
    label,
    invalid,
    placeholder,
    value,
    defaultValue,
    type,
    style: inlineStyle,
    layout = LAYOUT.DEFAULT,
    onChange,
    onFocus,
    ...restProps
  } = props;

  const innerRef = useRef<HTMLInputElement>(null);

  /* const [selection, setSelection] = useState<TSelectionData>({
    start: 0,
    end: 0,
  }); */

  const currency = useMemo(() => ` ${gt.gettext('Currency')}`, []);

  const inputProps = useMemo(() => {
    switch (type) {
      case INPUT_TYPE.NUMBER:
        return {
          type: INPUT_TYPE.NUMBER,
          value: String(value).replace(/[^\d/./,]/g, ''),
        };
      case INPUT_TYPE.CURRENCY:
        return {
          type: INPUT_TYPE.TEL,
          value: value, // + currency,
        };
      default:
        return { type, value };
    }
  }, [type, value]);

  /* const updateSelectionPosition = useCallback(
    (event) => {
      const target = event.currentTarget;
      const valueSize = size(String(value));

      let start = target.selectionStart;
      let end = target.selectionEnd;

      switch (type) {
        case INPUT_TYPE.CURRENCY:
          if (target.selectionStart > valueSize) {
            start = valueSize;
            end = start;
          }

          setSelection({ start, end });
      }
    },
    [type, value]
  ); */

  const onChangeHandler = useCallback(
    (event: any) => {
      // updateSelectionPosition(event);

      // let currentValue = event.currentTarget.value;

      /* switch (inputProps.type) {
        case INPUT_TYPE.NUMBER:
          if (!currentValue) {
            currentValue = inputProps.value;
          }

          break;
      } */

      // event.currentTarget.value = currentValue;

      if (onChange) {
        onChange(event);
      }
    },
    [onChange]
  );

  const onFocusHandler = useCallback(
    (event: any) => {
      // updateSelectionPosition(event);

      // const currentValue = event.currentTarget.value;

      /* switch (type) {
        case INPUT_TYPE.CURRENCY:
          event.currentTarget.value = currentValue.replace(currency, '');
      } */

      if (onFocus) {
        onFocus(event);
      }
    },
    [onFocus]
  );

  useEffect(() => {
    const target = innerRef.current;

    if (target) {
      if (ref) {
        if (isFunction(ref)) {
          ref(target);
        } else {
          (ref as TRef<HTMLInputElement>).current = target;
        }
      }

      /* switch (type) {
        case INPUT_TYPE.CURRENCY:
          target.selectionStart = selection.start;
          target.selectionEnd = selection.end;
      } */
    }
  }, [ref, type]);

  return (
    <div
      className={classNames(
        'input-widget',
        style.inputWidget,
        style[layout],
        className,
        {
          [style.placeholder]: placeholder && !placeholderEmbedded,
        }
      )}
      style={inlineStyle}
    >
      <WithTracking
        id={id}
        events={[EFocusEvents.FOCUS, EFocusEvents.BLUR, EKeyboardEvents.KEY_UP]}
      >
        <input
          {...restProps}
          id={id}
          className={classNames(
            'input-widget__input',
            style.input,
            inputClassName,
            { [style.error]: invalid }
          )}
          role={AbstractRoles.textbox}
          value={inputProps.value}
          defaultValue={defaultValue}
          placeholder={
            placeholder && placeholderEmbedded ? placeholder : void 0
          }
          onChange={(event) => onChangeHandler(event)}
          onFocus={(event) => onFocusHandler(event)}
          ref={innerRef}
          type={inputProps.type}
        />
      </WithTracking>
      {type == INPUT_TYPE.CURRENCY && (
        <div className={classNames('currency', style.currency)}>{currency}</div>
      )}
      {placeholder && !placeholderEmbedded && (
        <label
          className={classNames('input-widget__label', style.label, {
            [style.error]: invalid,
            [style.notEmpty]: inputProps.value || defaultValue,
          })}
          htmlFor={id}
        >
          {label || placeholder}
        </label>
      )}
      {layout == LAYOUT.SOFT && (
        <hr className={classNames('input-widget__hr', style.hr)} />
      )}
    </div>
  );
}

export const InputWidget = forwardRef(InputWidgetComponent);

function FileWidgetComponent(
  props: TInputWidgetProps,
  ref?: Ref<HTMLInputElement>
) {
  const {
    id = `InputWidget-${AbstractRoles.input}`,
    placeholderEmbedded = false,
    className,
    inputClassName,
    label,
    invalid,
    placeholder,
    value,
    type = INPUT_TYPE.FILE,
    style: inlineStyle,
    disabled,
    ...restProps
  } = props;

  return (
    <div
      className={classNames(style.inputWidget, className, {
        [style.placeholder]: placeholder && !placeholderEmbedded,
      })}
      style={inlineStyle}
    >
      <WithTracking id={id} events={[EMouseEvents.CLICK]}>
        <input
          {...restProps}
          id={id}
          className={classNames(style.input, inputClassName, {
            [style.error]: invalid,
          })}
          role={AbstractRoles.input}
          type={type}
          value={value}
          placeholder={
            placeholder && placeholderEmbedded ? placeholder : void 0
          }
          ref={ref}
          disabled={disabled}
        />
      </WithTracking>
      {placeholder && !placeholderEmbedded && (
        <label
          className={classNames(style.label, {
            [style.error]: invalid,
            [style.notEmpty]: value,
          })}
          htmlFor={id}
        >
          {label || placeholder}
        </label>
      )}
      <hr className={style.hr} />
    </div>
  );
}

export const FileWidget = forwardRef(FileWidgetComponent);
