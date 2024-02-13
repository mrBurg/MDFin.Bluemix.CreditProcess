import { TDirectoryItem } from '@stores-types/pageStore';
import { Props } from 'react-select';

export type TSelectBlurData = { name: string; value: string };
export type TSelectChangeData = TSelectBlurData & { id: number; label: string };

type TReactSelectWidgetCustom = Record<'name' | 'placeholder', string> &
  Partial<Record<'invalid' | 'disabled' | 'isSearchable', boolean>> & {
    value: string | number;
    onChange: (data: TSelectChangeData) => void;
    options: TDirectoryItem[];
    className?: string;
    onBlur?: (data: TSelectBlurData) => void;
  };

export type TReactSelectWidgetProps = Omit<Props, 'onChange' | 'onBlur'> &
  TReactSelectWidgetCustom;

export type TOption = {
  label: string;
  value?: number | string;
  id?: number;
  isDisabled?: boolean;
  manual_input?: string;
};
