import React from 'react';

import style from './preloader.module.scss';
import Spinner from './spinner.svg';

export function Preloader() {
  return (
    <div className={style.preloader}>
      <Spinner />
    </div>
  );
}
