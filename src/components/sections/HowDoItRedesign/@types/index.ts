export type TItem = Record<'data', string>;

export type THowDoItRedesignProps = Record<'items', TItem[]> &
  Record<'title' | 'subtitle', string>;
