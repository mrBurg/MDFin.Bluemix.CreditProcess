import React, { useContext } from 'react';
import classNames from 'classnames';

import style from './Header.module.scss';

import { MainMenu } from '@components/MainMenu';
import { HeaderConsumer, HeaderCtx } from '.';
import { LayoutCtx } from '@components/Layout';

function Header() {
  const { compressed } = useContext(HeaderCtx);
  const { blur } = useContext(LayoutCtx);

  return (
    <HeaderConsumer>
      {() => (
        <div
          className={classNames(style.holder, {
            [style.holderCompressed]: compressed,
            [style.holderBlur]: blur,
          })}
        >
          <header className={style.header}>
            <MainMenu />
          </header>
        </div>
      )}
    </HeaderConsumer>
  );
}

export { Header };
