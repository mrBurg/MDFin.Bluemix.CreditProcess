import React from 'react';
import classNames from 'classnames';

import style from './WithPageContainer.module.scss';

import { TWithPageContainerProps } from './@types';

function WithPageContainer(props: TWithPageContainerProps) {
  const { children, className } = props;

  return (
    <div className={classNames(style.pageContainer, className)}>{children}</div>
  );
}

export { WithPageContainer };
