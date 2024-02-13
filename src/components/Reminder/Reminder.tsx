import React, { useEffect, useState } from 'react';

import { TReminder, TReminderStore } from './@types';
import style from './Reminder.module.scss';
import cfg from '@root/config.json';
import { ThreeRow } from './ThreeRow';
import { TwoColTwoRow } from './TwoColTwoRow';
import { Loyalty } from './Loyalty';
import { STORE_IDS } from '@stores';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { getCookie, setCookie, stopScroll } from '@utils';
import { Draw } from './Draw';
import { TReminderResponse } from '@src/apis/@types/loanApi';
import { COOKIE } from '@src/constants';

function ReminderComponent(props: TReminder) {
  const [isRender, setIsRender] = useState(false);
  const reminderCloseCookie = getCookie(COOKIE.REMINDER_CLOSE);
  const [reminderData, setReminderData] = useState<TReminderResponse>();

  const { loanStore } = props as TReminderStore;

  const childReminder = () => {
    if (reminderData) {
      const template = reminderData.template
        ? reminderData.template
        : cfg.reminderTemplate;

      switch (template) {
        case 'ThreeRow':
          return <ThreeRow reminderData={reminderData} />;
        case 'TwoColTwoRow':
          return <TwoColTwoRow />;
        case 'Draw':
        case 'DrawResult':
          return <Draw reminderData={reminderData} />;
        case 'Loyalty':
          // return <TextContent reminderData={reminderData} />;
          return <Loyalty reminderData={reminderData} />;
        default:
          return <ThreeRow reminderData={reminderData} />;
      }
    }
  };

  useEffect(() => {
    const getReminderData = async () => {
      const response = await loanStore.reminder();

      setReminderData(response as TReminderResponse);

      const promoTemplates = new Set(['Draw', 'DrawResult']);

      if (
        response &&
        response.enabled &&
        !reminderCloseCookie &&
        (!props.showPromo || promoTemplates.has(response.template))
      ) {
        const timeout = response.delay ? response.delay : cfg.reminderTimeout;

        setTimeout(() => {
          setIsRender(true);
          stopScroll(true);
        }, timeout);
      }
    };

    getReminderData();
  }, [loanStore, props.showPromo, reminderCloseCookie]);

  return (
    <>
      {isRender && reminderData && (
        <div className={style.reminder}>
          <div className={style.reminder__container}>
            {childReminder()}
            <div className={style.reminder__content}>
              <div className={style.reminder__footer_text}></div>
              <div className={style.reminder__footer_more}></div>
            </div>
            <button
              className={classNames(style.reminder__close, {
                [style.reminder__close_white]:
                  reminderData.template == 'Draw' ||
                  reminderData.template == 'DrawResult' ||
                  reminderData.template == 'Loyalty',
              })}
              onClick={() => {
                setIsRender(false);
                setCookie(COOKIE.REMINDER_CLOSE, 1);
                document.body.classList.remove('no-scroll');
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export const Reminder = inject(STORE_IDS.LOAN_STORE)(
  observer(ReminderComponent)
);
