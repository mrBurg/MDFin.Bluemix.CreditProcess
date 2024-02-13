import React, { ReactElement, useState, useRef, useCallback } from 'react';
import classNames from 'classnames';

import style from './InputAutocompleteWidget.module.scss';

import { TInputAutocompleteWidgetProps } from './@types';
import { InputWidget } from '../InputWidget';
import { ReactSelectWidget } from '../ReactSelectWidget';
import { TChangeEvent, TFocusEvent } from '@interfaces';
import { handleErrors } from '@utils';

const InputAutocompleteWidgetComponent = (
  props: TInputAutocompleteWidgetProps
): ReactElement => {
  const { id, className, value, options, onChange, onBlur, ...restProps } =
    props;

  const [tooltip, setTooltip] = useState(false);
  const [inputVal, setInputVal] = useState(value);
  const [selectVal, setSelectVal] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const renderSelect = useCallback(() => {
    if (tooltip && inputVal) {
      return (
        <ReactSelectWidget
          inputId={`${id}-select`}
          name="inputAutocompleteWidgetSelect"
          className={style.inputSelect}
          placeholder={inputVal as string}
          options={options}
          inputValue={inputVal as string}
          menuIsOpen={true}
          value={selectVal}
          onChange={(data: any) => {
            const { value, label } = data;

            setSelectVal(value);
            setTooltip(false);

            new Promise((resolve) => resolve(setInputVal(label)))
              .then(() => {
                if (inputRef && inputRef.current) {
                  inputRef.current.dispatchEvent(
                    new Event('input', { bubbles: true })
                  );
                }

                return;
              })
              .catch((err) => {
                handleErrors(err);
              });
          }}
        />
      );
    }

    return null;
  }, [id, inputVal, options, selectVal, tooltip]);

  return (
    <div
      className={classNames(
        'input-autocomplete-widget',
        style.inputAutocompleteWidget,
        className
      )}
    >
      <InputWidget
        id={`${id}-input`}
        className={style.inputField}
        value={inputVal}
        onFocus={() => setTooltip(true)}
        onInput={(event: TChangeEvent) => {
          if (onChange) {
            onChange(event);
          }
        }}
        onChange={(event: TChangeEvent) => {
          const {
            currentTarget: { value },
          } = event;

          setTooltip(true);
          setInputVal(value);
          if (onChange) {
            onChange(event);
          }
        }}
        onBlur={(event: TFocusEvent) => {
          setTooltip(false);

          if (onBlur) {
            onBlur(event);
          }
        }}
        ref={inputRef}
        {...restProps}
      />
      {renderSelect()}
    </div>
  );
};

export const InputAutocompleteWidget = InputAutocompleteWidgetComponent;
