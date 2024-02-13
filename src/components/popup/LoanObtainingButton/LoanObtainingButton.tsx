import React, { useEffect, useState } from 'react';

import style from './LoanObtainingButton.module.scss';

import { gt } from '@utils';
import { LoanButton } from '@components/LoanButton';
import { EVENT } from '@src/constants';
import classNames from 'classnames';
import { useRef } from 'react';
// import { useRouter } from 'next/router';

function LoanObtainingButton() {
  // const { pathname } = useRouter();
  const [show, setShow] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setShow(Boolean(window.scrollY));

    window.addEventListener(EVENT.SCROLL, onScroll);

    return () => window.removeEventListener(EVENT.SCROLL, onScroll);
  }, []);

  useEffect(() => {
    if (container.current) {
      if (show) {
        container.current.classList.toggle('slideUp');

        return;
      }

      container.current.classList.remove('slideUp');
    }
  }, [container, show]);

  return (
    <div
      className={classNames(style.loanObtaining, {
        // [style.redesign]: pathname == '/redesign',
        [style.show]: show,
      })}
      ref={container}
    >
      <div className={style.holder}>
        <LoanButton
          className={style.button}
          label={gt.gettext('Register Loan')}
          idExt="Popup"
        />
      </div>
    </div>
  );
}

export { LoanObtainingButton };
