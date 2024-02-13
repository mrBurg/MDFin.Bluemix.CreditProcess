import { observer } from 'mobx-react';
import React from 'react';
import classNames from 'classnames';

import style from './ErrorNotification.module.scss';

import { TErrorNotificationProps } from './@types';

function ErrorNotificationComponent(props: TErrorNotificationProps) {
  const { className, error } = props;

  return error ? (
    <div className={classNames(style.notification, className)}>{error}</div>
  ) : null;
}

export const ErrorNotification = observer(ErrorNotificationComponent);
