export type TDirectoryItem = Record<'text', string> &
  Partial<
    Record<'value', string | number> &
      Record<'index', number> &
      Record<'manual_input', string> &
      Record<'disabled', boolean>
  >;
