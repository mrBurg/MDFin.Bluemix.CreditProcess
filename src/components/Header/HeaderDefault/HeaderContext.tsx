import { EVENT } from '@src/constants';
import { isDevice, root } from '@utils';
import React, { createContext, useEffect, useState } from 'react';
import { Header } from './Header';
import { THeaderContext, THeaderProps } from './@types';

export const HeaderCtx = createContext({} as THeaderContext);
export const HeaderProvider = HeaderCtx.Provider;
export const HeaderConsumer = HeaderCtx.Consumer;

function HeaderContext(props: THeaderProps) {
  const { less } = props;

  const [compressed, setCompressed] = useState(
    Boolean(root().scrollY && !isDevice())
  );

  useEffect(() => {
    const onScroll = () =>
      setCompressed(Boolean(window.scrollY && !isDevice()));

    window.addEventListener(EVENT.SCROLL, onScroll);

    return () => window.removeEventListener(EVENT.SCROLL, onScroll);
  }, []);

  return (
    <HeaderProvider value={{ less, compressed }}>
      <Header />
    </HeaderProvider>
  );
}

export { HeaderContext };
