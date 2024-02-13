export type TVendorStores = Record<'title', string> &
  Record<'googlePlay' | 'appStore', Record<'href' | 'img', string>>;
