import { TDirectoryItem } from '@stores-types/pageStore';
import { TOption } from './@types';

export function formatForSelect(options: TDirectoryItem[]): TOption[] {
  return options.reduce((previous: TOption[], current: TDirectoryItem) => {
    const { index, text, value, disabled, manual_input } = current;

    previous.push({
      id: index,
      label: text,
      value,
      isDisabled: disabled,
      manual_input,
    });

    return previous;
  }, []);
}
