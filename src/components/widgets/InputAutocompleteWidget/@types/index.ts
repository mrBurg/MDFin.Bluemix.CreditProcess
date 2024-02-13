import { TDirectoryItem } from '@stores-types/pageStore';
import { InputHTMLAttributes } from 'react';

export type TInputAutocompleteWidgetProps = {
  label?: string;
  invalid?: boolean;
  inputClassName?: string;
  placeholderEmbedded?: boolean;
  options: TDirectoryItem[];
} & InputHTMLAttributes<HTMLInputElement>;
