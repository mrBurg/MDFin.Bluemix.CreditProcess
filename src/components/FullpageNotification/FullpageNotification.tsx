import React from 'react';
import { TFullpageNotificationComponentProps } from './@types';

import style from './FullpageNotification.module.scss';

const FullpageNotificationComponent = (
  props: TFullpageNotificationComponentProps
) => {
  const { text } = props;

  return <div className={style.textHolder}>{text}</div>;
};

export const FullpageNotification = FullpageNotificationComponent;
