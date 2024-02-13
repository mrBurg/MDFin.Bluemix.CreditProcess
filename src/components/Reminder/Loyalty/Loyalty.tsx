import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import Image from 'next/image';

import style from './Loyalty.module.scss';

import { WithTag } from '@components/hocs';
import { TReminderChild } from './@types';
import { LoanButton } from '@components/LoanButton';
import isArray from 'lodash/isArray';
import map from 'lodash/map';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';

import Copy from './icons/copy.svg';
import { copyToClipboard } from '@utils';
import { staticApi } from '@stores';

function LoyaltyComponent(props: TReminderChild) {
  const { reminderData } = props;
  const [bufferText, setBufferText] = useState();

  /** не Android додаток */
  const [notApp, setNotApp] = useState(true);

  useEffect(() => {
    const init = async () => {
      const response = await staticApi.fetchStaticValue({
        block: 'reminder',
        path: 'loyalty bufferText',
      });

      if (response && response.value) setBufferText(response.value);
    };

    setNotApp(navigator.userAgent.toLowerCase().search('appname/1.0') == -1);

    init();
  }, []);

  const clickHandler = useCallback((bufferText?: string) => {
    if (bufferText) {
      copyToClipboard(bufferText);
    }
  }, []);

  // const bodyData = JSON.parse(reminderData.body);

  const bodyContent = useMemo(() => {
    const bodyData = JSON.parse(reminderData.body);

    switch (true) {
      case isArray(bodyData):
        return map(bodyData, (item, index) => (
          <WithTag
            key={index}
            tags={{
              copyButton: notApp && (
                <ButtonWidget
                  className={style.copyButton}
                  //onClick={() => clickHandler(bufferText)}
                  onClick={() => ({})} //якщо клікабельний весь div, тоді не потрібен онКлік
                  type={BUTTON_TYPE.BUTTON}
                >
                  <Copy />
                </ButtonWidget>
              ),
            }}
          >
            <div
              className={style.reminder__text}
              onClick={() => clickHandler(bufferText)}
              onKeyDown={() => clickHandler(bufferText)}
              role="link"
              tabIndex={0}
            >
              {item}
            </div>
          </WithTag>
        ));
      default:
        return (
          <WithTag
            tags={{
              copyButton: notApp && (
                <ButtonWidget
                  className={style.copyButton}
                  //onClick={() => clickHandler(bufferText)}
                  onClick={() => ({})} //якщо клікабельний весь div, тоді не потрібен онКлік
                  type={BUTTON_TYPE.BUTTON}
                >
                  <Copy />
                </ButtonWidget>
              ),
            }}
          >
            <div
              className={style.reminder__text}
              onClick={() => clickHandler(bufferText)}
              onKeyDown={() => clickHandler(bufferText)}
              role="link"
              tabIndex={0}
            >
              {reminderData.body}
            </div>
          </WithTag>
        );
    }
  }, [bufferText, clickHandler, notApp, reminderData.body]);

  return (
    <div className={classNames(style.reminder, style.reminder__content)}>
      <div className={style.imgBlock}>
        <Image src={`/images/reminder/loyalty.png`} width={379} height={461} />
      </div>

      <div className={style.txtBlock}>
        {reminderData.header && (
          <WithTag>
            <div
              className={style.reminder__header}
              onClick={() => clickHandler(bufferText)}
              onKeyDown={() => clickHandler(bufferText)}
              role="link"
              tabIndex={0}
            >
              {reminderData.header}
            </div>
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
    </div>
  );
}

export const Loyalty = observer(LoyaltyComponent);
