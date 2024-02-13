import React, { useCallback, useEffect, useRef, useState } from 'react';
import { inject } from 'mobx-react';
import map from 'lodash/map';
import size from 'lodash/size';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Copy from './icons/copy.svg';
import { copyToClipboard } from '@utils';
import { WithTag } from '@components/hocs';
import { STORE_IDS } from '@stores';

import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import {
  TMessage,
  TMessages,
  TServiceMessageProps,
  TServiceMessagePropsStore,
} from './@types';
import style from './ServiceMessage.module.scss';
import classNames from 'classnames';

function ServiceMessageComponent(props: TServiceMessageProps) {
  const { isCabinet, loyaltyStore } = props as TServiceMessagePropsStore;

  const sliderRef = useRef<Slider | null>(null);

  const [messages, setMessages] = useState({} as TMessages);

  /** не Android додаток */
  const [notApp, setNotApp] = useState(true);

  const sliderSettings = {
    className: style.slider,
    // dots: true,
    arrows: false,
    infinite: true,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: 'linear',
  };

  const clickHandler = useCallback((bufferText?: string) => {
    if (bufferText) {
      copyToClipboard(bufferText);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const response = await loyaltyStore.initServiceMessage(isCabinet);
      setMessages(response);
    };

    sliderRef.current?.slickPlay();
    setNotApp(navigator.userAgent.toLowerCase().search('appname/1.0') == -1);

    init();
  }, [isCabinet, loyaltyStore]);

  if (size(messages)) {
    return (
      <Slider ref={sliderRef} {...sliderSettings}>
        {map(
          messages,
          (item: TMessage, index: number) =>
            item.message && (
              <div
                key={index}
                className={classNames(style.default, style[item.className])}
              >
                <div className={style.wrap}>
                  <div className={style.image} />
                  <WithTag
                    tags={{
                      copyButton: notApp && (
                        <ButtonWidget
                          className={style.copyButton}
                          onClick={() => clickHandler(item.bufferText)}
                          type={BUTTON_TYPE.BUTTON}
                        >
                          <Copy />
                        </ButtonWidget>
                      ),
                    }}
                  >
                    <span>{item.message}</span>
                  </WithTag>
                </div>
              </div>
            )
        )}
      </Slider>
    );
  }
  return null;
}

export const ServiceMessage = inject(STORE_IDS.LOYALTY_STORE)(
  ServiceMessageComponent
);
