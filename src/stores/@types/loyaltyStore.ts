export type TLoyaltyInfo = Record<'input_available' | 'done', boolean> &
  Record<'program_name', string> &
  Record<'program_id', number>;
