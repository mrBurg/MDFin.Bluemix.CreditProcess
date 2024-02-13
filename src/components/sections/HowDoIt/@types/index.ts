export type TItem = Record<'data', string>;

export type THowDoItProps = Record<'items', TItem[]> &
  Record<'subtitle', string> &
  Partial<Record<'title', string>>;
