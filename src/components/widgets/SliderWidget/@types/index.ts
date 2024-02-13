import { CSSProperties, ReactElement, ReactNode } from 'react';
import { SliderProps } from 'rc-slider/lib/Slider';

export type TSliderWidgetProps = SliderProps & {
  sliderMarks?: Record<number, ReactNode>;
  marksStyle?: CSSProperties;
  output?: string | number | ReactElement;
};

export type TMarks = { style: CSSProperties; label: string };
