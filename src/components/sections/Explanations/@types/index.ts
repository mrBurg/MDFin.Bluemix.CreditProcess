import { TJSON } from '@interfaces';

export type TExplanationsProps = Record<'title' | 'text', string> &
  Partial<Record<'links' | 'tags', TJSON>>;
