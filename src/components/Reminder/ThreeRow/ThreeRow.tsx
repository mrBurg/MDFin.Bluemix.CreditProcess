import { observer } from 'mobx-react';
import classNames from 'classnames';
import React from 'react';

import style from './ThreeRow.module.scss';

import { WithTag } from '@components/hocs';
import { TReminderChild } from './@types';
import { LoanButton } from '@components/LoanButton';

function ThreeRowComponent(props: TReminderChild) {
  const { reminderData } = props;

  return (
    <div className={classNames(style.reminder, style.reminder__content)}>
      {reminderData.header && (
        <WithTag>
          <div className={style.reminder__header}>{reminderData.header}</div>
        </WithTag>
      )}

      {reminderData.body && (
        <WithTag>
          <div className={style.reminder__text}>{reminderData.body}</div>
        </WithTag>
      )}

      {reminderData.action && (
        <LoanButton
          className={style.reminderLoanButton}
          label={reminderData.action}
        />
      )}

      {reminderData.footnote && (
        <WithTag>
          <div className={style.reminder__footnote}>
            {reminderData.footnote}
          </div>
        </WithTag>
      )}
    </div>
  );
}

export const ThreeRow = observer(ThreeRowComponent);
