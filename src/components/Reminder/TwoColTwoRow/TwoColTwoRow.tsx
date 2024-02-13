import React, { PureComponent, ReactElement } from 'react';

import style from './TwoColTwoRow.module.scss';

import { TReminderChild, TState } from './@types';
import { WithDangerousHTML } from '@components/hocs';
import { LoanButton } from '@components/LoanButton';
import { staticApi } from '@stores';

export class TwoColTwoRow extends PureComponent<TReminderChild> {
  public readonly state: TState = {
    isRender: true,
    reminderData: {},
  };

  async componentDidMount(): Promise<void> {
    const reminderData = await staticApi.fetchStaticData({
      block: 'reminder',
      path: 'static',
    });

    this.setState({
      reminderData: reminderData,
    });
  }

  public render(): ReactElement | null {
    const { reminderData, isRender } = this.state;
    if (isRender) {
      return (
        <div className={style.reminder__content}>
          <div className={style.reminder__footer_text}>
            <WithDangerousHTML>
              <div>{reminderData.text}</div>
            </WithDangerousHTML>

            <LoanButton
              className={style.reminderLoanButton}
              label={reminderData.button}
            />
          </div>
          <div className={style.reminder__footer_more}></div>
        </div>
      );
    }
    return null;
  }
}
