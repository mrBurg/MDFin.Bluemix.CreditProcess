import React, { isValidElement, useCallback } from 'react';
import Slider from 'rc-slider';
import each from 'lodash/each';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import classNames from 'classnames';

import cfg from './style.json';
import style from './SliderWidget.module.scss';

import { WithTracking } from '@components/hocs';
import { WidgetRoles, AbstractRoles } from '@src/roles';
import { EWidgetEvent } from '@src/trackingConstants';
import { TMarks, TSliderWidgetProps } from './@types';
import { TJSON } from '@interfaces';

function SliderWidget(props: TSliderWidgetProps) {
  const {
    dots = false,
    dotStyle,
    handleStyle,
    trackStyle,
    sliderMarks,
    marksStyle,
    className,
    output,
    ...restProps
  } = props;

  if (sliderMarks) {
    each(sliderMarks, (mark, index) => {
      if (mark) {
        const { style, label } = mark as TMarks & any;

        (sliderMarks as TJSON)[index] = {
          style: {
            ...cfg.styleMarks,
            ...style,
            ...marksStyle,
          },
          label,
        };
      }
    });
  }

  const renderOutput = useCallback(() => {
    if (output) {
      switch (true) {
        case isString(output):
        case isNumber(output):
          return <div className={style.sliderAmount}>{output}</div>;
        case isValidElement(output):
          return output;
      }
    }
  }, [output]);

  return (
    <>
      {renderOutput()}
      <div className={classNames(className, style.sliderPanel)}>
        <WithTracking
          id={`SliderWidget-${WidgetRoles.slider}`}
          events={[EWidgetEvent.AFTER_CHANGE]}
        >
          <Slider
            className={style.slider}
            role={AbstractRoles.range}
            dots={dots}
            marks={sliderMarks}
            dotStyle={{ ...cfg.styleDot, ...dotStyle }}
            handleStyle={{ ...cfg.styleHandle, ...handleStyle }}
            trackStyle={{ ...cfg.styleTrack, ...trackStyle }}
            ariaLabelForHandle={'Slider handle'}
            {...restProps}
          />
        </WithTracking>
      </div>
    </>
  );
}

export { SliderWidget };
