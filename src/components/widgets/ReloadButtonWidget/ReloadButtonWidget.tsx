import React, { useCallback, useEffect, useRef, useState } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';

import style from './ReloadButtonWidget.module.scss';
import RefreshButton from '/public/theme/icons/refresh-button_36x36.svg';

import { TReloadButtonWidget, TReloadButtonWidgetStore } from './@types';
import { staticApi, STORE_IDS } from '@src/stores';
import { BUTTON_TYPE } from '@components/widgets/ButtonWidget';

function ReloadButtonComponent(props: TReloadButtonWidget) {
  const { className, reloadHandler, userStore } =
    props as TReloadButtonWidgetStore;

  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [isAnimate, setIsAnimate] = useState(false);
  const [finishReload, setFinishReload] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const onReloadButton = useCallback(async () => {
    setIsDisabled(true);

    if (!isDisabled) {
      setCurrentCount(1);
      if (reloadHandler) {
        reloadHandler(() => {
          setFinishReload(true);
        });
      } else {
        await userStore.getClientNextStep(() => {
          setFinishReload(true);
        });
      }
    }
  }, [isDisabled, reloadHandler, userStore]);

  /**Добавляет + 1 к animation iteration count пока нет ответа от сервиса(переменная finishReload)*/
  useEffect(() => {
    if (currentCount && !finishReload) {
      if (buttonRef.current) {
        buttonRef.current.style.animationIterationCount = `${currentCount}`;
        setIsAnimate(true);
      }

      const waitResponse = setTimeout(() => {
        setCurrentCount(currentCount + 1);
        clearTimeout(waitResponse);
        return;
      }, 1000);
    }

    setCurrentCount(0);
    return;
  }, [currentCount, finishReload]);

  useEffect(() => {
    const getTitle = async () => {
      const response = await staticApi.fetchStaticValue({
        block: 'refreshButton',
        path: 'title',
      });

      if (response && response.value) {
        setTitle(response.value);
      }
    };

    getTitle();
  }, []);

  return (
    <div
      className={classNames(
        'reload-button-widget',
        style.buttonWrap,
        className
      )}
    >
      <div className={style.status}>{title}</div>

      <button
        ref={buttonRef}
        className={classNames(style.statusButtonWrap, {
          [style.statusActive]: isAnimate,
        })}
        type={BUTTON_TYPE.BUTTON}
        onClick={() => onReloadButton()}
        onAnimationEnd={() => {
          setIsDisabled(false);
          setIsAnimate(false);
          setFinishReload(false);
        }}
        disabled={isDisabled}
      >
        <RefreshButton />
      </button>
    </div>
  );
}

export const ReloadButtonWidget = inject(STORE_IDS.USER_STORE)(
  observer(ReloadButtonComponent)
);
