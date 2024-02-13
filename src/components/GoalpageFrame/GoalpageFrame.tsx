import React, { Fragment, ReactElement, useEffect, useState } from 'react';
import { inject } from 'mobx-react';
import htmlParser from 'html-react-parser';

import style from './GoalpageFrame.module.scss';

import { URIS, URLS } from '@routes';
import { DATA_TYPE, GOALPAGE } from '@src/constants';
import { STORE_IDS } from '@stores';
import { TGoalpageFrame, TGoalpageFrameStore } from './@types';
import isArray from 'lodash/isArray';
import filter from 'lodash/filter';
import { UserStore } from '@src/stores/UserStore';

/**
 * @deprecated Ця функція, задумувалась, щоб не дублювати на кожній сторінці цей ідентичнний код.
 * Але, на різних сторінках "goalpage_XXX", викликаються різні сервіси.
 */
export function useGoalpageEffect(
  userStore: UserStore,
  callback: (data: ReactElement[]) => void
) {
  useEffect(() => {
    const init = async () => {
      const response = await userStore.getPageFrameData(URIS.GOALPAGE_SCRIPT);

      if (response) {
        const elements = htmlParser(response);
        let elementsArray = [elements];

        if (isArray(elements)) {
          elementsArray = elements;
        }

        callback(
          filter(
            elementsArray as unknown as ReactElement[],
            (element, index) => {
              if (element && element.type != DATA_TYPE.SCRIPT) {
                return true;
              }

              let script = document.querySelector<HTMLScriptElement>(
                `#${element.type}${index}`
              );

              if (script) {
                script.textContent =
                  element.props.dangerouslySetInnerHTML.__html;
              } else {
                script = document.createElement('script');

                script.id = element.type + String(index);
                script.textContent =
                  element.props.dangerouslySetInnerHTML.__html;
                script.async = true;

                document.body.appendChild(script);
              }

              return false;
            }
          ).map((element, index) => <Fragment key={index}>{element}</Fragment>)
        );
      }
    };

    init();
  }, [callback, userStore]);
}

/** MDFC-12094 Facebook pixel */
export function GoalpageStartFrameComponent(props: TGoalpageFrame) {
  const { userStore } = props as TGoalpageFrameStore;

  const [scriptCode, setScriptCode] = useState('');

  useEffect(() => {
    const init = async () => {
      const response = await userStore.getPageFrameData(URIS.PIXEL_SCRIPT);

      setScriptCode(response);
    };

    init();
  }, [userStore]);

  if (scriptCode) {
    return (
      <iframe
        className={style.goalpage}
        title="GoalpageStartFrame"
        src={URLS.GOALPAGE_START}
        onLoad={() => userStore.updateGoalpage(URIS.PIXEL)}
      />
    );
  }

  return <></>;
}
export const GoalpageStartFrame = inject(STORE_IDS.USER_STORE)(
  GoalpageStartFrameComponent
);

function GoalpageFrameComponent(props: TGoalpageFrame) {
  const { userStore } = props as TGoalpageFrameStore;

  return (
    <iframe
      className={style.goalpage}
      title="GoalpageFrame"
      src={(() => {
        switch (userStore.pageFrame) {
          case GOALPAGE.GOALPAGE:
            return URLS.GOALPAGE;
          case GOALPAGE.GOALPAGE_ALL:
            return URLS.GOALPAGE_ALL;
        }
      })()}
      onLoad={() => userStore.updateGoalpage(URIS.GOALPAGE)}
    />
  );
}

export const GoalpageFrame = inject(STORE_IDS.USER_STORE)(
  GoalpageFrameComponent
);
