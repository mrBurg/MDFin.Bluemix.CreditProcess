import { GetStaticPropsContext, NextComponentType } from 'next';
import { TJSON } from './commons';

export type TAppPageProps = Record<'Component', NextComponentType> &
  Record<
    'pageProps',
    Record<'context', GetStaticPropsContext> &
      Record<'pageData' | 'template', TJSON>
  >;
