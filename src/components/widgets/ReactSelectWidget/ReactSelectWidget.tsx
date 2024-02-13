import React, { forwardRef, Ref, useCallback, useMemo } from 'react';
import Select, { components } from 'react-select';
import classNames from 'classnames';
import size from 'lodash/size';

import style from './ReactSelectWidget.module.scss';

import { TReactSelectWidgetProps } from './@types';
import { formatForSelect } from './reactSelectWidgetUtils';
import { gt } from '@utils';
import { TJSON } from '@interfaces';
import { AbstractRoles } from '@src/roles';

function ReactSelectWidgetComponent(
  props: TReactSelectWidgetProps,
  ref: Ref<any>
) {
  const {
    className,
    value,
    onBlur,
    onChange,
    options,
    invalid = false,
    isSearchable = false,
    placeholder,
    inputId = `SelectWidget-${AbstractRoles.select}`,
    ...restProps
  } = props;

  const optionsData = useMemo(() => formatForSelect(options), [options]);

  const activeIndex = useMemo(
    () => options.findIndex((item: any) => item.value == value),
    [options, value]
  );

  const ControlComponent = useCallback(
    (props: any) => (
      <div className={style.selectControl}>
        {!!size(props.getValue()) && (
          <label className={style.selectLabel}>{placeholder}</label>
        )}
        <components.Control {...props} />
      </div>
    ),
    [placeholder]
  );

  /* const InputComponent = useCallback(
    (props: any) => (
      <div className={style.selectControl}>
        <label className={style.selectLabel}>{placeholder}</label>
        <components.Input {...props} />
      </div>
    ),
    [placeholder]
  ); */

  const selectProps = useMemo(
    () => ({
      inputId,
      className: classNames(
        'select-widget',
        style.select,
        { 'select-widget--has-error': invalid },
        className
      ),
      value: optionsData[activeIndex] ?? null,
      classNamePrefix: 'select-widget',
      /* onBlur: onBlur
        ? function (this: HTMLInputElement) {
            onBlur({ name: this.name, value: this.value });
          }
        : void 0, */
      // ВАЖНО
      // https://mdfin.myjetbrains.com/youtrack/issue/MDFC-9662
      // На мобильном устройстве, при выборе в поле любое значение - данное поле подсвечивается красным.
      //  После повторного выбора поле перестает подсвечиваться

      onChange: (data: any, props: TJSON) => {
        onChange({
          id: data.id,
          name: props.name,
          value: data.value,
          label: data.label,
        });

        if (onBlur) {
          onBlur({ name: props.name, value: data.value });
        }
      },
      options: optionsData,
      isSearchable,
      noOptionsMessage: () => gt.gettext('noOptions'),
      placeholder,
      components: { Control: ControlComponent /* Input: InputComponent */ },
      ref,
    }),
    [
      ControlComponent,
      activeIndex,
      className,
      inputId,
      invalid,
      isSearchable,
      onBlur,
      onChange,
      optionsData,
      placeholder,
      ref,
    ]
  );

  return <Select {...selectProps} {...restProps} />;
}

export const ReactSelectWidget = forwardRef(ReactSelectWidgetComponent);
