import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';

import style from './HeaderRedesign.module.scss';

import { MainMenuRedesign } from '@components/MainMenuRedesign';
import { HeaderRedesignConsumer } from '.';
import { LayoutCtx } from '@components/Layout';
import { root } from '@utils';
import { EVENT } from '@src/constants';

function HeaderRedesign() {
  const { blur } = useContext(LayoutCtx);

  const [pinned, setPinned] = useState(Boolean(root().scrollY));

  useEffect(() => {
    const onScroll = () => setPinned(Boolean(window.scrollY));
    window.addEventListener(EVENT.SCROLL, onScroll);

    return () => window.removeEventListener(EVENT.SCROLL, onScroll);
  }, []);

  return (
    <HeaderRedesignConsumer>
      {() => (
        <div
          className={classNames(style.holder, {
            [style.holderBlur]: blur,
            [style.holderPinned]: pinned,
          })}
        >
          <header className={style.header}>
            <MainMenuRedesign />
          </header>
        </div>
      )}
    </HeaderRedesignConsumer>
  );
}

export { HeaderRedesign };
