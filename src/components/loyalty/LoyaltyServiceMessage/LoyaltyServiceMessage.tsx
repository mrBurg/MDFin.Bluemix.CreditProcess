import size from 'lodash/size';
import { inject, observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';

import style from './LoyaltyServiceMessage.module.scss';
import Copy from './icons/copy.svg';

import {
  TLoyaltyServiceMessageProps,
  TLoyaltyServiceMessagePropsStore,
  TMessages,
} from './@types';
import { WithTag } from '@components/hocs';
import { STORE_IDS } from '@stores';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import { copyToClipboard } from '@utils';

/**
 * @deprecated Тепер, напряму використовується компонент ServiceMessage.
 * Вся логіка, перенесена туди
 */
function LoyaltyServiceMessageComponent(props: TLoyaltyServiceMessageProps) {
  const { loyaltyStore, isCabinet } = props as TLoyaltyServiceMessagePropsStore;

  const [messages, setMessages] = useState({} as TMessages);

  const clickHandler = useCallback(() => {
    if (messages.bufferText) {
      copyToClipboard(messages.bufferText);
    }
  }, [messages.bufferText]);

  useEffect(() => {
    const init = async () => {
      const messages = await loyaltyStore.initLoyaltyServiceMessage(isCabinet);

      setMessages(messages);
    };

    init();
  }, [isCabinet, loyaltyStore]);

  if (size(messages) && messages.message) {
    return (
      <div className={classNames(props.className, style.serviceMessage)}>
        <WithTag
          tags={{
            copyButton: (
              <ButtonWidget
                className={style.copyButton}
                onClick={() => clickHandler()}
                type={BUTTON_TYPE.BUTTON}
              >
                <Copy />
              </ButtonWidget>
            ),
          }}
        >
          <span>{messages.message}</span>
        </WithTag>
      </div>
    );
  }

  return null;
}

export const LoyaltyServiceMessage = inject(STORE_IDS.LOYALTY_STORE)(
  observer(LoyaltyServiceMessageComponent)
);
