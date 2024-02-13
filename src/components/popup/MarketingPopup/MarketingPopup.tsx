import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import style from './MarketingPopup.module.scss';

import { Preloader } from '@components/Preloader';
import { TJSON } from '@interfaces';
import { TMarketingPopup } from './@types';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import { WidgetRoles } from '@src/roles';
import { staticApi } from '@stores';
import CheckIcon from '/public/theme/icons/check-icon.svg';

function MarketingPopup(props: TMarketingPopup) {
  //   const [isRender, setIsRender] = useState(props.isRender);
  const isRender = useMemo(() => props.isRender, [props.isRender]);

  const [data, setData] = useState({} as TJSON);

  useEffect(() => {
    const init = async () => {
      const staticData = await staticApi.fetchStaticData({
        block: 'marketingPopup',
        path: 'static',
      });

      setData(staticData);
    };

    init();
  }, []);

  if (isRender) {
    if (data) {
      return (
        <div className={style.popup__holder}>
          <div
            className={classNames(style.popup, {
              [style.redesign]: props.isRedesign,
            })}
          >
            <button
              className={style.popup__close}
              onClick={props.callbackClose}
            />
            {props.isRedesign && <CheckIcon />}
            <div className={style.popup__text}>{data.text}</div>
            <div className={style.popup__buttons}>
              <ButtonWidget
                id={`MarketingPopup-accept-${WidgetRoles.button}-${BUTTON_TYPE.BUTTON}`}
                className={classNames(style.button, 'button_big button_blue')}
                type={BUTTON_TYPE.BUTTON}
                //disabled={formDisabled}
                onClick={props.callbackAccept}
              >
                {data.acceptButton}
              </ButtonWidget>
              <ButtonWidget
                id={`MarketingPopup-decline-${WidgetRoles.button}-${BUTTON_TYPE.BUTTON}`}
                className={classNames(
                  style.button,
                  'button_small button_inline'
                )}
                type={BUTTON_TYPE.BUTTON}
                // dissabled={formDisabled}
                onClick={props.callbackDecline}
              >
                {data.declineButton}
              </ButtonWidget>
            </div>
          </div>
        </div>
      );
    }
    return <Preloader />;
  }
  return null;
}

export { MarketingPopup };
