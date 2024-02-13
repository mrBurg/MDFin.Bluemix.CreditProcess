import React from 'react';

import { TBlackOutProps } from './@types';
import style from './BlackOut.module.scss';

import { Preloader } from '@components/Preloader';

function BlackOut(props: TBlackOutProps) {
  const { showPreloader } = props;

  return (
    <div className={style.container}>{showPreloader && <Preloader />}</div>
  );
}

export { BlackOut };
