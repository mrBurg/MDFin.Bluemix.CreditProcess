export type TWelcomeProps = Record<'mainText', string> &
  Record<'steps', string[]> &
  Partial<Record<'description', string>>;
