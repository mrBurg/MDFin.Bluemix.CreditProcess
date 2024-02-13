import React, { useState, useEffect } from 'react';
import { withRouter } from 'next/router';

import { EVENT, SIZE } from '@src/constants';
import { isDevice } from '@utils';
import { MobileMenuRedesign } from './MobileMenuRedesign';
import { DesktopMenuRedesign } from './DesktopMenuRedesign';

function MainMenuRedesignComponent() {
  const [isMob, setIsMob] = useState(isDevice(SIZE.XL));
  const [menu, setMenu] = useState(<></>); //useState(<DesktopMenu />);

  useEffect(() => {
    setMenu(isMob ? <MobileMenuRedesign /> : <DesktopMenuRedesign />);
  }, [isMob]);

  useEffect(() => {
    const detectDeviceType = () => {
      setIsMob(isDevice(SIZE.XL));
    };

    window.addEventListener(EVENT.RESIZE, detectDeviceType);

    return () => window.removeEventListener(EVENT.RESIZE, detectDeviceType);
  }, []);

  return menu;
}

export const MainMenuRedesign = withRouter(MainMenuRedesignComponent);
