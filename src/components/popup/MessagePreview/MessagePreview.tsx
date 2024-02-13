import React, { useCallback, useEffect } from 'react';
import classNames from 'classnames';

import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import CloseIcon from './icons/close.svg';
import { stopScroll } from '@utils';

import { CHANNEL, TMessagePreviewProps } from './@types';
import style from './MessagePreview.module.scss';
import { WithTag } from '@components/hocs';

function MessagePreview(props: TMessagePreviewProps) {
  const { type, contentData, declineHandler } = props;

  const renderCloseButton = useCallback(() => {
    return (
      <ButtonWidget
        type={BUTTON_TYPE.BUTTON}
        className={style.closeButton}
        onClick={declineHandler}
      >
        <CloseIcon />
      </ButtonWidget>
    );
  }, [declineHandler]);

  const renderSms = useCallback(() => {
    return (
      <WithTag>
        <div className={style.modalText}>{contentData.body}</div>
      </WithTag>
    );
  }, [contentData.body]);

  const renderEmail = useCallback(() => {
    return (
      <div className={style.contentWrap}>
        {contentData.subject && (
          <span
            className={style.title}
          >{`${contentData.subject} :: ${contentData.sender}`}</span>
        )}
        <div className={style.headerWrap}>
          <div className={style.headerInfo}>
            {contentData.sender && (
              <div className={style.headerInfoItem}>
                <span className={style.label}>{'Sender:'}</span>
                <span>{contentData.sender}</span>
              </div>
            )}
            {contentData.subject && (
              <div className={style.headerInfoItem}>
                <span className={style.label}>{'Subject:'}</span>
                <span>{contentData.subject}</span>
              </div>
            )}
          </div>
        </div>
        <iframe
          title="emailFrame"
          srcDoc={contentData.body}
          className={style.frame}
        />
      </div>
    );
  }, [contentData]);

  const renderContent = useCallback(() => {
    if (type == CHANNEL.SMS) return renderSms();
    return renderEmail();
  }, [renderEmail, renderSms, type]);

  useEffect(() => {
    stopScroll(true);

    return () => {
      stopScroll(false);
    };
  }, []);

  return (
    <div className={classNames(style.modalContainer)}>
      <div
        className={classNames(style.modal, {
          [style.modalSms]: type == CHANNEL.SMS,
        })}
      >
        {renderContent()}
        {renderCloseButton()}
      </div>
    </div>
  );
}

export { MessagePreview };
