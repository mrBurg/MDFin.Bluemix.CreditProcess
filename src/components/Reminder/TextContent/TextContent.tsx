import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import classNames from 'classnames';

import style from './TextContent.module.scss';

import { WithTag } from '@components/hocs';
import { TReminderChild } from './@types';
import { LoanButton } from '@components/LoanButton';
import isArray from 'lodash/isArray';
import map from 'lodash/map';

function TextContentComponent(props: TReminderChild) {
  const { reminderData } = props;

  // const bodyData = JSON.parse(reminderData.body);

  const bodyContent = useMemo(() => {
    const bodyData = JSON.parse(reminderData.body);

    switch (true) {
      case isArray(bodyData):
        return map(bodyData, (item, index) => (
          <WithTag key={index}>
            <div className={style.reminder__text}>{item}</div>
          </WithTag>
        ));
      default:
        return (
          <WithTag>
            <div className={style.reminder__text}>{reminderData.body}</div>
          </WithTag>
        );
    }
  }, [reminderData.body]);

  return (
    <div className={classNames(style.reminder, style.reminder__content)}>
      {reminderData.header && (
        <WithTag>
          <div className={style.reminder__header}>{reminderData.header}</div>
        </WithTag>
      )}

      {reminderData.body && bodyContent}

      {reminderData.action && (
        <LoanButton
          className={style.reminderLoanButton}
          label={reminderData.action}
        />
      )}
    </div>
  );
}

export const TextContent = observer(TextContentComponent);
