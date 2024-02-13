import classNames from 'classnames';
import React, { Fragment, ReactElement, useCallback, useEffect } from 'react';

import isArray from 'lodash/isArray';
import map from 'lodash/map';
import noop from 'lodash/noop';
import reduce from 'lodash/reduce';

import style from './ModalWindow.module.scss';

import CloseIcon from './icons/close.svg';

import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import { TModalWindowProps } from './@types';
import { WithTag } from '@components/hocs';
import { stopScroll } from '@utils';
import { TJSON } from '@interfaces';

export enum MODAL_TYPE {
  MODAL = 'modal',
  PROMPT = 'prompt',
  TRANSPARENT = 'transparent',
}

function ModalWindow(props: TModalWindowProps) {
  const {
    textData,
    staticData,
    acceptHandler,
    declineHandler,
    confirmDisplay = noop,
    type = MODAL_TYPE.MODAL,
    classname,
  } = props;

  const renderCloseButton = useCallback(() => {
    if (type != MODAL_TYPE.PROMPT) {
      return (
        <ButtonWidget
          type={BUTTON_TYPE.BUTTON}
          className={style.closeButton}
          onClick={declineHandler}
        >
          <CloseIcon />
        </ButtonWidget>
      );
    }
  }, [declineHandler, type]);

  const renderPromptButtons = useCallback(() => {
    if (type == MODAL_TYPE.PROMPT && staticData) {
      return (
        <div className={style.buttons}>
          <ButtonWidget
            type={BUTTON_TYPE.BUTTON}
            className={style.promptAccept}
            onClick={acceptHandler}
          >
            {staticData.acceptButtonText}
          </ButtonWidget>
          <ButtonWidget
            type={BUTTON_TYPE.BUTTON}
            className={style.promptDecline}
            onClick={declineHandler}
          >
            {staticData.declineButtonText}
          </ButtonWidget>
        </div>
      );
    }
  }, [acceptHandler, declineHandler, staticData, type]);

  const renderText = useCallback(() => {
    const renderContent = (child: ReactElement) => {
      const tags = [
        {
          className: style.modalImg,
          name: 'popap_exist.jpg',
        },
        {
          className: style.modalImg,
          name: 'popup_new.jpg',
        },
        {
          className: classNames(style.modalImg, style.modalImg_border),
          name: 'popup_bonus.jpg',
        },
        {
          className: style.modalImg,
          name: 'popup_valentine23.jpg',
        },
        {
          className: classNames(style.modalImg, style.modalImg_border),
          name: 'popup_reactivation_v2.png',
        },
        {
          className: style.modalImg,
          name: 'popup_spring_days_23.png',
        },
        {
          className: style.modalImg,
          name: 'popup_bonus_may.jpg',
        },
        {
          className: style.modalImg,
          name: 'popup-c13-upsell.png',
        },
      ];

      return (
        <WithTag
          tags={reduce(
            tags,
            (accum, item: TJSON, index: number) => ({
              ...accum,
              [`img_loyalty_${index}`]: (
                <img
                  key={index}
                  className={item.className}
                  src={`/images/modal-window/${item.name}`}
                  alt={item.name}
                />
              ),
            }),
            {} as TJSON
          )}
        >
          {child}
        </WithTag>
      );
    };

    if (isArray(textData)) {
      return map(textData, (item, index) => (
        <Fragment key={index}>
          {renderContent(
            <div
              className={classNames(
                classname,
                style.modalText,
                style.modalTextRow,
                style[`modalTextRow-${index}`]
              )}
            >
              {item}
            </div>
          )}
        </Fragment>
      ));
    }

    return renderContent(
      <div className={classNames(classname, style.modalText)}>{textData}</div>
    );
  }, [classname, textData]);

  useEffect(() => {
    stopScroll(true);

    return () => stopScroll(false);
  }, []);

  useEffect(() => {
    confirmDisplay();
  });

  return (
    <div
      className={classNames(style.modalContainer, {
        [style.modalTransparent]: type == MODAL_TYPE.TRANSPARENT,
      })}
    >
      <div className={style.modal}>
        {renderText()}
        {renderCloseButton()}
        {renderPromptButtons()}
      </div>
    </div>
  );
}

export { ModalWindow };
