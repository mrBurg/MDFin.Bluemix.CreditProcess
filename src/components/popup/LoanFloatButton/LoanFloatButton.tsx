import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import style from './LoanFloatButton.module.scss';

import { gt, isDevice } from '@utils';
import { LoanButton } from '@components/LoanButton';
import { EVENT, SIZE } from '@src/constants';
import Image from 'next/image';

function LoanFloatButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!isDevice(SIZE.XL)) {
      setShowButton(true);
      return;
    }

    const onScroll = () => {
      setShowButton(Boolean(window.scrollY));
    };
    window.addEventListener(EVENT.SCROLL, onScroll);

    return () => window.removeEventListener(EVENT.SCROLL, onScroll);
  }, []);

  return (
    <div
      className={classNames(
        style.floatPanel,
        { [style.floatPanelShow]: showButton },
        'floatPanel floatPanelGap'
      )}
    >
      <div className={style.holder}>
        <div className={style.left}>
          <div className={style.text}>
            {'Foarte rapid! Ai banii pe card in 30 de minute!'}
          </div>
          <div className={style.button}>
            <LoanButton
              className={style.floatButton}
              label={gt.gettext('Start Loan')}
              idExt="LoanFloatButton"
            />
          </div>
        </div>
        <div className={style.right}>
          <Image
            width={128}
            height={173}
            src={'/images/main-page/welcome/lady-wow-phone.webp'}
          />
        </div>
      </div>
    </div>
  );
}

export { LoanFloatButton };
