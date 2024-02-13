import React, { useState } from 'react';
import Image from 'next/image';
import router from 'next/router';

import { WithTag } from '@components/hocs';
import classNames from 'classnames';
import { TReminderChild } from './@types';
import style from './Draw.module.scss';
import { LinkWidget } from '@components/widgets/LinkWidget';
import { LoanButton } from '@components/LoanButton';

function Draw(props: TReminderChild) {
  const [isRender] = useState(true);
  const { reminderData } = props;
  const urlPage = '/hollydays-happy-draw';
  const result = reminderData.template == 'DrawResult' ? true : false;
  // const backgroundUrl = reminderData.template == 'DrawResult' ? '_result' : '';

  const changeRoute = () => {
    document.body.classList.remove('no-scroll');
    return router.push(urlPage);
  };

  const renderAction = () => {
    if (!reminderData.action) return;

    if (result) {
      return (
        <div className={style.button__wrap}>
          <LinkWidget
            href={urlPage}
            className={classNames(style.button, 'button_orange')}
            onClick={() => {
              document.body.classList.remove('no-scroll');
            }}
          >
            {reminderData.action}
          </LinkWidget>
        </div>
      );
    } else {
      return (
        <div className={style.button__wrap}>
          <LoanButton
            location="Draw"
            className={style.button}
            label={reminderData.action}
          />
        </div>
      );
    }
  };

  const renderFootnote = () => {
    if (!reminderData.footnote) return;

    if (result) {
      return (
        <LoanButton
          location="Draw"
          className={style.button_footnote}
          label={reminderData.footnote}
        />
      );
    } else {
      return (
        <WithTag>
          <LinkWidget
            href={urlPage}
            className={style.reminder__footnote}
            onClick={() => {
              document.body.classList.remove('no-scroll');
            }}
          >
            {reminderData.footnote}
          </LinkWidget>
        </WithTag>
      );
    }
  };

  if (isRender) {
    return (
      <div
        className={classNames(style.reminder, style.reminder__content, {
          [style.reminder__content_result]: result,
        })}
        onClick={changeRoute}
        onKeyDown={changeRoute}
        role="link"
        tabIndex={0}
      >
        {!result && (
          <div className={style.bow}>
            <Image
              src={'/images/reminder/hollydays-happy-draw/bow.png'}
              alt={'bow'}
              width={305}
              height={216}
            />
          </div>
        )}
        <div
          className={classNames(style.imgBlock, {
            [style.imgBlock_result]: result,
          })}
        >
          <div className={style.imgItem}>
            {!result && (
              <Image
                src={`/images/reminder/hollydays-happy-draw/car-shtender2.png`}
                width={338}
                height={305}
              />
            )}
            {result && (
              <Image
                src={`/images/reminder/hollydays-happy-draw/car-confetti.png`}
                width={369}
                height={328}
              />
            )}
          </div>
        </div>
        <div
          className={classNames(style.txtBlock, {
            [style.txtBlock_result]: result,
          })}
        >
          {reminderData.header && (
            <WithTag>
              <div
                className={classNames(style.reminder__header, {
                  [style.reminder__header_result]: result,
                })}
              >
                {reminderData.header}
              </div>
            </WithTag>
          )}
          {reminderData.body && (
            <>
              <div
                className={classNames(style.reminder__middle, {
                  [style.reminder__middle_result]: result,
                })}
              >
                <WithTag>
                  <span>{reminderData.body}</span>
                </WithTag>
              </div>
            </>
          )}
          {renderAction()}

          {renderFootnote()}
        </div>
      </div>
    );
  }
  return null;
}

export { Draw };
